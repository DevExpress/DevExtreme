import Animator from '__internal/ui/scroll_view/animator';
import animationFrame from '__internal/common/core/animation/frameModule';

const REQUEST_ANIMATION_FRAME_TIMEOUT = 10;

QUnit.module('Animator', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.requestAnimationFrameStub = sinon.stub(animationFrame, 'requestAnimationFrame').callsFake((callback) => {
            return window.setTimeout(callback, REQUEST_ANIMATION_FRAME_TIMEOUT);
        });
    },

    afterEach: function() {
        this.clock.restore();
        this.requestAnimationFrameStub.restore();
    }
}, () => {
    QUnit.test('basic', function(assert) {
        assert.expect(1);

        let stepsAmount = 10;

        class TestAnimator extends Animator {
            _isFinished() {
                return stepsAmount <= 0;
            }

            _step() {
                stepsAmount--;
            }

            _complete() {
                assert.ok(true, 'animation executed');
            }
        };
        const animator = new TestAnimator();

        animator.start();
        this.clock.tick(10 * REQUEST_ANIMATION_FRAME_TIMEOUT);
    });

    QUnit.test('stop', function(assert) {
        assert.expect(2);

        let stepsAmount = 10;

        class TestAnimator extends Animator {
            _isFinished() {
                return stepsAmount <= 0;
            }

            _step() {
                stepsAmount--;
                if(stepsAmount === 5) {
                    animator.stop();
                }
            }

            _stop() {
                assert.ok(true, 'animation stopped');
                assert.equal(stepsAmount, 5, 'animation stopped with right iteration amount');
            }

            _complete() {
                assert.ok(false, 'complete shouldn`t be fired');
            }
        };
        const animator = new TestAnimator();

        animator.start();
        this.clock.tick(10 * REQUEST_ANIMATION_FRAME_TIMEOUT);
    });

    QUnit.test('infinite execution without isFinished callback', function(assert) {
        assert.expect(2);

        let completed = 0;
        let stepCount = 0;

        class TestAnimator extends Animator {
            _step() {
                stepCount++;
            }

            _complete() {
                completed++;
            }
        }
        const animator = new TestAnimator();

        animator.start();

        this.clock.tick(500);

        assert.equal(completed, 0, 'complete was not called');
        assert.ok(stepCount > 0, 'animation is working');
        animator.stop();
    });

    QUnit.test('animation without step callback', function(assert) {
        assert.expect(2);

        let completed = 0;
        let stepCount = 0;

        class TestAnimator extends Animator {
            _step() {
                stepCount++;
            }

            _complete() {
                completed++;
            }
        };
        const animator = new TestAnimator();

        animator.start();

        this.clock.tick(500);

        assert.equal(completed, 0, 'complete was not called');
        assert.ok(stepCount > 0, 'animation is working');
        animator.stop();
    });
});

