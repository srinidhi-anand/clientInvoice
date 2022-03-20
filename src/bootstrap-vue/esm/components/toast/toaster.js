import { PortalTarget, Wormhole } from 'portal-vue';
import { Vue } from '../../vue';
import { NAME_TOASTER } from '../../constants/components';
import { EVENT_NAME_DESTROYED, HOOK_EVENT_NAME_BEFORE_DESTROY } from '../../constants/events';
import { PROP_TYPE_STRING } from '../../constants/props';
import { removeClass, requestAF } from '../../utils/dom';
import { getRootEventName } from '../../utils/events';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { warn } from '../../utils/warn';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Helper components ---
// @vue/component

export var DefaultTransition = /*#__PURE__*/Vue.extend({
  mixins: [normalizeSlotMixin],
  data: function data() {
    return {
      // Transition classes base name
      name: 'b-toaster'
    };
  },
  methods: {
    onAfterEnter: function onAfterEnter(el) {
      var _this = this;

      // Work around a Vue.js bug where `*-enter-to` class is not removed
      // See: https://github.com/vuejs/vue/pull/7901
      // The `*-move` class is also stuck on elements that moved,
      // but there are no JavaScript hooks to handle after move
      // See: https://github.com/vuejs/vue/pull/7906
      requestAF(function () {
        removeClass(el, "".concat(_this.name, "-enter-to"));
      });
    }
  },
  render: function render(h) {
    return h('transition-group', {
      props: {
        tag: 'div',
        name: this.name
      },
      on: {
        afterEnter: this.onAfterEnter
      }
    }, this.normalizeSlot());
  }
}); // --- Props ---

export var props = makePropsConfigurable({
  // Allowed: 'true' or 'false' or `null`
  ariaAtomic: makeProp(PROP_TYPE_STRING),
  ariaLive: makeProp(PROP_TYPE_STRING),
  name: makeProp(PROP_TYPE_STRING, undefined, true),
  // Required
  // Aria role
  role: makeProp(PROP_TYPE_STRING)
}, NAME_TOASTER); // --- Main component ---
// @vue/component

export var BToaster = /*#__PURE__*/Vue.extend({
  name: NAME_TOASTER,
  mixins: [listenOnRootMixin],
  props: props,
  data: function data() {
    return {
      // We don't render on SSR or if a an existing target found
      doRender: false,
      dead: false,
      // Toaster names cannot change once created
      staticName: this.name
    };
  },
  beforeMount: function beforeMount() {
    var _this2 = this;

    var name = this.name;
    this.staticName = name;
    /* istanbul ignore if */

    if (Wormhole.hasTarget(name)) {
      warn("A \"<portal-target>\" with name \"".concat(name, "\" already exists in the document."), NAME_TOASTER);
      this.dead = true;
    } else {
      this.doRender = true;
      this.$once(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
        // Let toasts made with `this.$bvToast.toast()` know that this toaster
        // is being destroyed and should should also destroy/hide themselves
        _this2.emitOnRoot(getRootEventName(NAME_TOASTER, EVENT_NAME_DESTROYED), name);
      });
    }
  },
  destroyed: function destroyed() {
    // Remove from DOM if needed
    var $el = this.$el;
    /* istanbul ignore next: difficult to test */

    if ($el && $el.parentNode) {
      $el.parentNode.removeChild($el);
    }
  },
  render: function render(h) {
    var $toaster = h('div', {
      class: ['d-none', {
        'b-dead-toaster': this.dead
      }]
    });

    if (this.doRender) {
      var $target = h(PortalTarget, {
        staticClass: 'b-toaster-slot',
        props: {
          name: this.staticName,
          multiple: true,
          tag: 'div',
          slim: false,
          // transition: this.transition || DefaultTransition
          transition: DefaultTransition
        }
      });
      $toaster = h('div', {
        staticClass: 'b-toaster',
        class: [this.staticName],
        attrs: {
          id: this.staticName,
          // Fallback to null to make sure attribute doesn't exist
          role: this.role || null,
          'aria-live': this.ariaLive,
          'aria-atomic': this.ariaAtomic
        }
      }, [$target]);
    }

    return $toaster;
  }
});