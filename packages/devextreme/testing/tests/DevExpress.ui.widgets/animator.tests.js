import Animator from '__internal/ui/scroll_view/m_animator';
import animationFrame from 'common/core/animation/frame';

const REQEST_ANIMATION_FRAME_TIMEOUT = 10;

QUnit.module('Animator', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.originalRAF = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            return window.setTimeout(callback, REQEST_ANIMATION_FRAME_TIMEOUT);
        };
    },

    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this.originalRAF;
    }
}, () => {
    QUnit.test('basic', function(assert) {
        assert.expect(1);

        let stepsAmount = 10;

        const TestAnimator = Animator.inherit({
            _isFinished: function() {
                return stepsAmount <= 0;
            },

            _step: function() {
                stepsAmount--;
            },

            _complete: function() {
                assert.ok(true, 'animation executed');
            }
        });
        const animator = new TestAnimator();

        animator.start();
        this.clock.tick(10 * REQEST_ANIMATION_FRAME_TIMEOUT);
    });

    QUnit.test('stop', function(assert) {
        assert.expect(2);

        let stepsAmount = 10;

        const TestAnimator = Animator.inherit({
            _isFinished: function() {
                return stepsAmount <= 0;
            },

            _step: function() {
                stepsAmount--;
                if(stepsAmount === 5) {
                    animator.stop();
                }
            },

            _stop: function() {
                assert.ok(true, 'animation stopped');
                assert.equal(stepsAmount, 5, 'animation stopped with right iteration amount');
            },

            _complete: function() {
                assert.ok(false, 'complete shouldn`t be fired');
            }
        });
        const animator = new TestAnimator();

        animator.start();
        this.clock.tick(10 * REQEST_ANIMATION_FRAME_TIMEOUT);
    });

    QUnit.test('infinite execution without isFinished callback', function(assert) {
        assert.expect(2);

        let completed = 0;
        let stepCount = 0;

        const TestAnimator = Animator.inherit({
            _step: function() {
                stepCount++;
            },

            _complete: function() {
                completed++;
            }
        });
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

        const TestAnimator = Animator.inherit({
            _step: function() {
                stepCount++;
            },

            _complete: function() {
                completed++;
            }
        });
        const animator = new TestAnimator();

        animator.start();

        this.clock.tick(500);

        assert.equal(completed, 0, 'complete was not called');
        assert.ok(stepCount > 0, 'animation is working');
        animator.stop();
    });
});

