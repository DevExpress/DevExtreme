(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}, global.ng.core.primitives = {})));
})(this, (function (exports) { 'use strict';

    /**
     * @license Angular v17.3.0
     * (c) 2010-2022 Google LLC. https://angular.io/
     * License: MIT
     */

    /**
     * The default equality function used for `signal` and `computed`, which uses referential equality.
     */
    function defaultEquals(a, b) {
        return Object.is(a, b);
    }

    /**
     * The currently active consumer `ReactiveNode`, if running code in a reactive context.
     *
     * Change this via `setActiveConsumer`.
     */
    let activeConsumer = null;
    let inNotificationPhase = false;
    /**
     * Global epoch counter. Incremented whenever a source signal is set.
     */
    let epoch = 1;
    /**
     * Symbol used to tell `Signal`s apart from other functions.
     *
     * This can be used to auto-unwrap signals in various cases, or to auto-wrap non-signal values.
     */
    const SIGNAL = /* @__PURE__ */ Symbol('SIGNAL');
    function setActiveConsumer(consumer) {
        const prev = activeConsumer;
        activeConsumer = consumer;
        return prev;
    }
    function getActiveConsumer() {
        return activeConsumer;
    }
    function isInNotificationPhase() {
        return inNotificationPhase;
    }
    function isReactive(value) {
        return value[SIGNAL] !== undefined;
    }
    const REACTIVE_NODE = {
        version: 0,
        lastCleanEpoch: 0,
        dirty: false,
        producerNode: undefined,
        producerLastReadVersion: undefined,
        producerIndexOfThis: undefined,
        nextProducerIndex: 0,
        liveConsumerNode: undefined,
        liveConsumerIndexOfThis: undefined,
        consumerAllowSignalWrites: false,
        consumerIsAlwaysLive: false,
        producerMustRecompute: () => false,
        producerRecomputeValue: () => { },
        consumerMarkedDirty: () => { },
        consumerOnSignalRead: () => { },
    };
    /**
     * Called by implementations when a producer's signal is read.
     */
    function producerAccessed(node) {
        if (inNotificationPhase) {
            throw new Error(typeof ngDevMode !== 'undefined' && ngDevMode ?
                `Assertion error: signal read during notification phase` :
                '');
        }
        if (activeConsumer === null) {
            // Accessed outside of a reactive context, so nothing to record.
            return;
        }
        activeConsumer.consumerOnSignalRead(node);
        // This producer is the `idx`th dependency of `activeConsumer`.
        const idx = activeConsumer.nextProducerIndex++;
        assertConsumerNode(activeConsumer);
        if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
            // There's been a change in producers since the last execution of `activeConsumer`.
            // `activeConsumer.producerNode[idx]` holds a stale dependency which will be be removed and
            // replaced with `this`.
            //
            // If `activeConsumer` isn't live, then this is a no-op, since we can replace the producer in
            // `activeConsumer.producerNode` directly. However, if `activeConsumer` is live, then we need
            // to remove it from the stale producer's `liveConsumer`s.
            if (consumerIsLive(activeConsumer)) {
                const staleProducer = activeConsumer.producerNode[idx];
                producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
                // At this point, the only record of `staleProducer` is the reference at
                // `activeConsumer.producerNode[idx]` which will be overwritten below.
            }
        }
        if (activeConsumer.producerNode[idx] !== node) {
            // We're a new dependency of the consumer (at `idx`).
            activeConsumer.producerNode[idx] = node;
            // If the active consumer is live, then add it as a live consumer. If not, then use 0 as a
            // placeholder value.
            activeConsumer.producerIndexOfThis[idx] =
                consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
        }
        activeConsumer.producerLastReadVersion[idx] = node.version;
    }
    /**
     * Increment the global epoch counter.
     *
     * Called by source producers (that is, not computeds) whenever their values change.
     */
    function producerIncrementEpoch() {
        epoch++;
    }
    /**
     * Ensure this producer's `version` is up-to-date.
     */
    function producerUpdateValueVersion(node) {
        if (consumerIsLive(node) && !node.dirty) {
            // A live consumer will be marked dirty by producers, so a clean state means that its version
            // is guaranteed to be up-to-date.
            return;
        }
        if (!node.dirty && node.lastCleanEpoch === epoch) {
            // Even non-live consumers can skip polling if they previously found themselves to be clean at
            // the current epoch, since their dependencies could not possibly have changed (such a change
            // would've increased the epoch).
            return;
        }
        if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
            // None of our producers report a change since the last time they were read, so no
            // recomputation of our value is necessary, and we can consider ourselves clean.
            node.dirty = false;
            node.lastCleanEpoch = epoch;
            return;
        }
        node.producerRecomputeValue(node);
        // After recomputing the value, we're no longer dirty.
        node.dirty = false;
        node.lastCleanEpoch = epoch;
    }
    /**
     * Propagate a dirty notification to live consumers of this producer.
     */
    function producerNotifyConsumers(node) {
        if (node.liveConsumerNode === undefined) {
            return;
        }
        // Prevent signal reads when we're updating the graph
        const prev = inNotificationPhase;
        inNotificationPhase = true;
        try {
            for (const consumer of node.liveConsumerNode) {
                if (!consumer.dirty) {
                    consumerMarkDirty(consumer);
                }
            }
        }
        finally {
            inNotificationPhase = prev;
        }
    }
    /**
     * Whether this `ReactiveNode` in its producer capacity is currently allowed to initiate updates,
     * based on the current consumer context.
     */
    function producerUpdatesAllowed() {
        return activeConsumer?.consumerAllowSignalWrites !== false;
    }
    function consumerMarkDirty(node) {
        node.dirty = true;
        producerNotifyConsumers(node);
        node.consumerMarkedDirty?.(node);
    }
    /**
     * Prepare this consumer to run a computation in its reactive context.
     *
     * Must be called by subclasses which represent reactive computations, before those computations
     * begin.
     */
    function consumerBeforeComputation(node) {
        node && (node.nextProducerIndex = 0);
        return setActiveConsumer(node);
    }
    /**
     * Finalize this consumer's state after a reactive computation has run.
     *
     * Must be called by subclasses which represent reactive computations, after those computations
     * have finished.
     */
    function consumerAfterComputation(node, prevConsumer) {
        setActiveConsumer(prevConsumer);
        if (!node || node.producerNode === undefined || node.producerIndexOfThis === undefined ||
            node.producerLastReadVersion === undefined) {
            return;
        }
        if (consumerIsLive(node)) {
            // For live consumers, we need to remove the producer -> consumer edge for any stale producers
            // which weren't dependencies after the recomputation.
            for (let i = node.nextProducerIndex; i < node.producerNode.length; i++) {
                producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
            }
        }
        // Truncate the producer tracking arrays.
        // Perf note: this is essentially truncating the length to `node.nextProducerIndex`, but
        // benchmarking has shown that individual pop operations are faster.
        while (node.producerNode.length > node.nextProducerIndex) {
            node.producerNode.pop();
            node.producerLastReadVersion.pop();
            node.producerIndexOfThis.pop();
        }
    }
    /**
     * Determine whether this consumer has any dependencies which have changed since the last time
     * they were read.
     */
    function consumerPollProducersForChange(node) {
        assertConsumerNode(node);
        // Poll producers for change.
        for (let i = 0; i < node.producerNode.length; i++) {
            const producer = node.producerNode[i];
            const seenVersion = node.producerLastReadVersion[i];
            // First check the versions. A mismatch means that the producer's value is known to have
            // changed since the last time we read it.
            if (seenVersion !== producer.version) {
                return true;
            }
            // The producer's version is the same as the last time we read it, but it might itself be
            // stale. Force the producer to recompute its version (calculating a new value if necessary).
            producerUpdateValueVersion(producer);
            // Now when we do this check, `producer.version` is guaranteed to be up to date, so if the
            // versions still match then it has not changed since the last time we read it.
            if (seenVersion !== producer.version) {
                return true;
            }
        }
        return false;
    }
    /**
     * Disconnect this consumer from the graph.
     */
    function consumerDestroy(node) {
        assertConsumerNode(node);
        if (consumerIsLive(node)) {
            // Drop all connections from the graph to this node.
            for (let i = 0; i < node.producerNode.length; i++) {
                producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
            }
        }
        // Truncate all the arrays to drop all connection from this node to the graph.
        node.producerNode.length = node.producerLastReadVersion.length = node.producerIndexOfThis.length =
            0;
        if (node.liveConsumerNode) {
            node.liveConsumerNode.length = node.liveConsumerIndexOfThis.length = 0;
        }
    }
    /**
     * Add `consumer` as a live consumer of this node.
     *
     * Note that this operation is potentially transitive. If this node becomes live, then it becomes
     * a live consumer of all of its current producers.
     */
    function producerAddLiveConsumer(node, consumer, indexOfThis) {
        assertProducerNode(node);
        assertConsumerNode(node);
        if (node.liveConsumerNode.length === 0) {
            // When going from 0 to 1 live consumers, we become a live consumer to our producers.
            for (let i = 0; i < node.producerNode.length; i++) {
                node.producerIndexOfThis[i] = producerAddLiveConsumer(node.producerNode[i], node, i);
            }
        }
        node.liveConsumerIndexOfThis.push(indexOfThis);
        return node.liveConsumerNode.push(consumer) - 1;
    }
    /**
     * Remove the live consumer at `idx`.
     */
    function producerRemoveLiveConsumerAtIndex(node, idx) {
        assertProducerNode(node);
        assertConsumerNode(node);
        if (typeof ngDevMode !== 'undefined' && ngDevMode && idx >= node.liveConsumerNode.length) {
            throw new Error(`Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`);
        }
        if (node.liveConsumerNode.length === 1) {
            // When removing the last live consumer, we will no longer be live. We need to remove
            // ourselves from our producers' tracking (which may cause consumer-producers to lose
            // liveness as well).
            for (let i = 0; i < node.producerNode.length; i++) {
                producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
            }
        }
        // Move the last value of `liveConsumers` into `idx`. Note that if there's only a single
        // live consumer, this is a no-op.
        const lastIdx = node.liveConsumerNode.length - 1;
        node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
        node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
        // Truncate the array.
        node.liveConsumerNode.length--;
        node.liveConsumerIndexOfThis.length--;
        // If the index is still valid, then we need to fix the index pointer from the producer to this
        // consumer, and update it from `lastIdx` to `idx` (accounting for the move above).
        if (idx < node.liveConsumerNode.length) {
            const idxProducer = node.liveConsumerIndexOfThis[idx];
            const consumer = node.liveConsumerNode[idx];
            assertConsumerNode(consumer);
            consumer.producerIndexOfThis[idxProducer] = idx;
        }
    }
    function consumerIsLive(node) {
        return node.consumerIsAlwaysLive || (node?.liveConsumerNode?.length ?? 0) > 0;
    }
    function assertConsumerNode(node) {
        node.producerNode ??= [];
        node.producerIndexOfThis ??= [];
        node.producerLastReadVersion ??= [];
    }
    function assertProducerNode(node) {
        node.liveConsumerNode ??= [];
        node.liveConsumerIndexOfThis ??= [];
    }

    /**
     * Create a computed signal which derives a reactive value from an expression.
     */
    function createComputed(computation) {
        const node = Object.create(COMPUTED_NODE);
        node.computation = computation;
        const computed = () => {
            // Check if the value needs updating before returning it.
            producerUpdateValueVersion(node);
            // Record that someone looked at this signal.
            producerAccessed(node);
            if (node.value === ERRORED) {
                throw node.error;
            }
            return node.value;
        };
        computed[SIGNAL] = node;
        return computed;
    }
    /**
     * A dedicated symbol used before a computed value has been calculated for the first time.
     * Explicitly typed as `any` so we can use it as signal's value.
     */
    const UNSET = /* @__PURE__ */ Symbol('UNSET');
    /**
     * A dedicated symbol used in place of a computed signal value to indicate that a given computation
     * is in progress. Used to detect cycles in computation chains.
     * Explicitly typed as `any` so we can use it as signal's value.
     */
    const COMPUTING = /* @__PURE__ */ Symbol('COMPUTING');
    /**
     * A dedicated symbol used in place of a computed signal value to indicate that a given computation
     * failed. The thrown error is cached until the computation gets dirty again.
     * Explicitly typed as `any` so we can use it as signal's value.
     */
    const ERRORED = /* @__PURE__ */ Symbol('ERRORED');
    // Note: Using an IIFE here to ensure that the spread assignment is not considered
    // a side-effect, ending up preserving `COMPUTED_NODE` and `REACTIVE_NODE`.
    // TODO: remove when https://github.com/evanw/esbuild/issues/3392 is resolved.
    const COMPUTED_NODE = /* @__PURE__ */ (() => {
        return {
            ...REACTIVE_NODE,
            value: UNSET,
            dirty: true,
            error: null,
            equal: defaultEquals,
            producerMustRecompute(node) {
                // Force a recomputation if there's no current value, or if the current value is in the
                // process of being calculated (which should throw an error).
                return node.value === UNSET || node.value === COMPUTING;
            },
            producerRecomputeValue(node) {
                if (node.value === COMPUTING) {
                    // Our computation somehow led to a cyclic read of itself.
                    throw new Error('Detected cycle in computations.');
                }
                const oldValue = node.value;
                node.value = COMPUTING;
                const prevConsumer = consumerBeforeComputation(node);
                let newValue;
                try {
                    newValue = node.computation();
                }
                catch (err) {
                    newValue = ERRORED;
                    node.error = err;
                }
                finally {
                    consumerAfterComputation(node, prevConsumer);
                }
                if (oldValue !== UNSET && oldValue !== ERRORED && newValue !== ERRORED &&
                    node.equal(oldValue, newValue)) {
                    // No change to `valueVersion` - old and new values are
                    // semantically equivalent.
                    node.value = oldValue;
                    return;
                }
                node.value = newValue;
                node.version++;
            },
        };
    })();

    function defaultThrowError() {
        throw new Error();
    }
    let throwInvalidWriteToSignalErrorFn = defaultThrowError;
    function throwInvalidWriteToSignalError() {
        throwInvalidWriteToSignalErrorFn();
    }
    function setThrowInvalidWriteToSignalError(fn) {
        throwInvalidWriteToSignalErrorFn = fn;
    }

    /**
     * If set, called after `WritableSignal`s are updated.
     *
     * This hook can be used to achieve various effects, such as running effects synchronously as part
     * of setting a signal.
     */
    let postSignalSetFn = null;
    /**
     * Create a `Signal` that can be set or updated directly.
     */
    function createSignal(initialValue) {
        const node = Object.create(SIGNAL_NODE);
        node.value = initialValue;
        const getter = (() => {
            producerAccessed(node);
            return node.value;
        });
        getter[SIGNAL] = node;
        return getter;
    }
    function setPostSignalSetFn(fn) {
        const prev = postSignalSetFn;
        postSignalSetFn = fn;
        return prev;
    }
    function signalSetFn(node, newValue) {
        if (!producerUpdatesAllowed()) {
            throwInvalidWriteToSignalError();
        }
        if (!node.equal(node.value, newValue)) {
            node.value = newValue;
            signalValueChanged(node);
        }
    }
    function signalUpdateFn(node, updater) {
        if (!producerUpdatesAllowed()) {
            throwInvalidWriteToSignalError();
        }
        signalSetFn(node, updater(node.value));
    }
    // Note: Using an IIFE here to ensure that the spread assignment is not considered
    // a side-effect, ending up preserving `COMPUTED_NODE` and `REACTIVE_NODE`.
    // TODO: remove when https://github.com/evanw/esbuild/issues/3392 is resolved.
    const SIGNAL_NODE = /* @__PURE__ */ (() => {
        return {
            ...REACTIVE_NODE,
            equal: defaultEquals,
            value: undefined,
        };
    })();
    function signalValueChanged(node) {
        node.version++;
        producerIncrementEpoch();
        producerNotifyConsumers(node);
        postSignalSetFn?.();
    }

    function createWatch(fn, schedule, allowSignalWrites) {
        const node = Object.create(WATCH_NODE);
        if (allowSignalWrites) {
            node.consumerAllowSignalWrites = true;
        }
        node.fn = fn;
        node.schedule = schedule;
        const registerOnCleanup = (cleanupFn) => {
            node.cleanupFn = cleanupFn;
        };
        function isWatchNodeDestroyed(node) {
            return node.fn === null && node.schedule === null;
        }
        function destroyWatchNode(node) {
            if (!isWatchNodeDestroyed(node)) {
                consumerDestroy(node); // disconnect watcher from the reactive graph
                node.cleanupFn();
                // nullify references to the integration functions to mark node as destroyed
                node.fn = null;
                node.schedule = null;
                node.cleanupFn = NOOP_CLEANUP_FN;
            }
        }
        const run = () => {
            if (node.fn === null) {
                // trying to run a destroyed watch is noop
                return;
            }
            if (isInNotificationPhase()) {
                throw new Error(`Schedulers cannot synchronously execute watches while scheduling.`);
            }
            node.dirty = false;
            if (node.hasRun && !consumerPollProducersForChange(node)) {
                return;
            }
            node.hasRun = true;
            const prevConsumer = consumerBeforeComputation(node);
            try {
                node.cleanupFn();
                node.cleanupFn = NOOP_CLEANUP_FN;
                node.fn(registerOnCleanup);
            }
            finally {
                consumerAfterComputation(node, prevConsumer);
            }
        };
        node.ref = {
            notify: () => consumerMarkDirty(node),
            run,
            cleanup: () => node.cleanupFn(),
            destroy: () => destroyWatchNode(node),
            [SIGNAL]: node,
        };
        return node.ref;
    }
    const NOOP_CLEANUP_FN = () => { };
    // Note: Using an IIFE here to ensure that the spread assignment is not considered
    // a side-effect, ending up preserving `COMPUTED_NODE` and `REACTIVE_NODE`.
    // TODO: remove when https://github.com/evanw/esbuild/issues/3392 is resolved.
    const WATCH_NODE = /* @__PURE__ */ (() => {
        return {
            ...REACTIVE_NODE,
            consumerIsAlwaysLive: true,
            consumerAllowSignalWrites: false,
            consumerMarkedDirty: (node) => {
                if (node.schedule !== null) {
                    node.schedule(node.ref);
                }
            },
            hasRun: false,
            cleanupFn: NOOP_CLEANUP_FN,
        };
    })();

    function setAlternateWeakRefImpl(impl) {
        // TODO: remove this function
    }

    exports.REACTIVE_NODE = REACTIVE_NODE;
    exports.SIGNAL = SIGNAL;
    exports.SIGNAL_NODE = SIGNAL_NODE;
    exports.consumerAfterComputation = consumerAfterComputation;
    exports.consumerBeforeComputation = consumerBeforeComputation;
    exports.consumerDestroy = consumerDestroy;
    exports.consumerMarkDirty = consumerMarkDirty;
    exports.consumerPollProducersForChange = consumerPollProducersForChange;
    exports.createComputed = createComputed;
    exports.createSignal = createSignal;
    exports.createWatch = createWatch;
    exports.defaultEquals = defaultEquals;
    exports.getActiveConsumer = getActiveConsumer;
    exports.isInNotificationPhase = isInNotificationPhase;
    exports.isReactive = isReactive;
    exports.producerAccessed = producerAccessed;
    exports.producerNotifyConsumers = producerNotifyConsumers;
    exports.producerUpdateValueVersion = producerUpdateValueVersion;
    exports.producerUpdatesAllowed = producerUpdatesAllowed;
    exports.setActiveConsumer = setActiveConsumer;
    exports.setAlternateWeakRefImpl = setAlternateWeakRefImpl;
    exports.setPostSignalSetFn = setPostSignalSetFn;
    exports.setThrowInvalidWriteToSignalError = setThrowInvalidWriteToSignalError;
    exports.signalSetFn = signalSetFn;
    exports.signalUpdateFn = signalUpdateFn;

}));
