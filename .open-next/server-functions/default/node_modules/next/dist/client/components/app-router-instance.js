"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createMutableActionQueue: null,
    getCurrentAppRouterState: null,
    publicAppRouterInstance: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createMutableActionQueue: function() {
        return createMutableActionQueue;
    },
    getCurrentAppRouterState: function() {
        return getCurrentAppRouterState;
    },
    publicAppRouterInstance: function() {
        return publicAppRouterInstance;
    }
});
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _routerreducer = require("./router-reducer/router-reducer");
const _react = require("react");
const _isthenable = require("../../shared/lib/is-thenable");
const _approuterstate = require("./app-router-state");
const _useactionqueue = require("./use-action-queue");
const _rendertree = require("./render-tree");
const _addbasepath = require("../add-base-path");
const _approuterutils = require("./app-router-utils");
const _javascripturl = require("../lib/javascript-url");
const _navigator = require("./navigator");
const _prefetch = require("./prefetch");
function runRemainingActions(actionQueue, settledAction, setState) {
    // Only advance the queue if the settled action is still at its head. If a
    // navigation discarded this action, the navigation took its place and is
    // still in flight — starting the next queued action now would run it
    // against router state that doesn't include the navigation yet.
    if (actionQueue.pending === settledAction) {
        actionQueue.pending = settledAction.next;
        if (actionQueue.pending !== null) {
            runAction({
                actionQueue,
                action: actionQueue.pending,
                setState
            });
            return;
        }
    }
    if (actionQueue.pending === null) {
        if (actionQueue.wasPreempted) {
            actionQueue.wasPreempted = false;
            // When an action is preempted, later actions can update the queue's state without React rendering it.
            // Once the queue is empty, publish the final state so the UI catches up.
            (0, _react.startTransition)(()=>setState(actionQueue.state));
        }
        if (actionQueue.needsRefresh) {
            // The queue is idle; flush the refresh requested by a discarded server
            // action that revalidated data.
            actionQueue.needsRefresh = false;
            actionQueue.dispatch({
                type: _routerreducertypes.ACTION_REFRESH
            }, setState);
        }
    }
}
function runAction({ actionQueue, action, setState }) {
    const prevState = actionQueue.state;
    actionQueue.pending = action;
    const payload = action.payload;
    function handleError(err) {
        runRemainingActions(actionQueue, action, setState);
        action.reject(err);
    }
    function handleResult(nextState) {
        // if we discarded this action, the state should also be discarded
        if (action.discarded) {
            // Check if the discarded server action revalidated data
            if (action.payload.type === _routerreducertypes.ACTION_SERVER_ACTION && action.payload.didRevalidate) {
                // The server action was discarded but it revalidated data,
                // mark that we need to refresh after all actions complete
                actionQueue.needsRefresh = true;
            }
            // This can't advance the queue (this action is no longer its head), but
            // if the queue has already drained, it flushes the refresh now.
            runRemainingActions(actionQueue, action, setState);
            return;
        }
        actionQueue.state = nextState;
        runRemainingActions(actionQueue, action, setState);
        action.resolve(nextState);
    }
    let actionResult;
    try {
        actionResult = actionQueue.action(prevState, payload);
    } catch (err) {
        handleError(err);
        return;
    }
    // if the action is a promise, set up a callback to resolve it
    if ((0, _isthenable.isThenable)(actionResult)) {
        actionResult.then(handleResult, handleError);
    } else {
        handleResult(actionResult);
    }
}
function dispatchAction(actionQueue, payload, setState) {
    let resolvers = {
        resolve: setState,
        reject: ()=>{}
    };
    // most of the action types are async with the exception of restore
    // it's important that restore is handled quickly since it's fired on the popstate event
    // and we don't want to add any delay on a back/forward nav
    // this only creates a promise for the async actions
    if (payload.type !== _routerreducertypes.ACTION_RESTORE) {
        // Create the promise and assign the resolvers to the object.
        const deferredPromise = new Promise((resolve, reject)=>{
            resolvers = {
                resolve,
                reject
            };
        });
        (0, _react.startTransition)(()=>{
            // we immediately notify React of the pending promise -- the resolver is attached to the action node
            // and will be called when the associated action promise resolves
            setState(deferredPromise);
        });
    }
    const newAction = {
        payload,
        next: null,
        resolve: resolvers.resolve,
        reject: resolvers.reject
    };
    // Check if the queue is empty
    if (actionQueue.pending === null) {
        // The queue is empty, so add the action and start it immediately
        // Mark this action as the last in the queue
        actionQueue.last = newAction;
        runAction({
            actionQueue,
            action: newAction,
            setState
        });
    } else if (payload.type === _routerreducertypes.ACTION_NAVIGATE || payload.type === _routerreducertypes.ACTION_RESTORE) {
        // Navigations (including back/forward) take priority over any pending actions.
        // Mark the pending action as discarded (so the state is never applied) and start the navigation action immediately.
        actionQueue.pending.discarded = true;
        actionQueue.wasPreempted = true;
        // The rest of the current queue should still execute after this navigation.
        // (Note that it can't contain any earlier navigations, because we always put those into `actionQueue.pending` by calling `runAction`)
        newAction.next = actionQueue.pending.next;
        if (actionQueue.last === actionQueue.pending) {
            actionQueue.last = newAction;
        }
        runAction({
            actionQueue,
            action: newAction,
            setState
        });
    } else {
        // The queue is not empty, so add the action to the end of the queue
        // It will be started by runRemainingActions after the previous action finishes
        if (actionQueue.last !== null) {
            actionQueue.last.next = newAction;
        }
        actionQueue.last = newAction;
    }
}
let globalActionQueue = null;
function createMutableActionQueue(initialState) {
    const actionQueue = {
        state: initialState,
        dispatch: (payload, setState)=>dispatchAction(actionQueue, payload, setState),
        action: _routerreducer.reducer,
        pending: null,
        last: null
    };
    if (typeof window !== 'undefined') {
        // The action queue is lazily created on hydration, but after that point
        // it doesn't change. So we can store it in a global rather than pass
        // it around everywhere via props/context.
        if (globalActionQueue !== null) {
            throw new Error('Internal Next.js Error: createMutableActionQueue was called more ' + 'than once');
        }
        globalActionQueue = actionQueue;
    }
    return actionQueue;
}
function getCurrentAppRouterState() {
    return globalActionQueue !== null ? globalActionQueue.state : null;
}
/**
 * (Experimental) Perform a gesture navigation. This dispatches through React's
 * useOptimistic instead of the main action queue, allowing the state to be
 * shown during a gesture transition and discarded when the canonical navigation
 * completes.
 *
 * Only available when experimental.gestureTransition is enabled.
 */ function gesturePush(href, options) {
    if (process.env.__NEXT_GESTURE_TRANSITION) {
        // TODO: Trigger a prefetch so the cache starts populating if there isn't
        // already a prefetch for this route.
        if ((0, _javascripturl.isJavaScriptURLString)(href)) {
            throw new Error('Next.js has blocked a javascript: URL as a security precaution.');
        }
        const state = getCurrentAppRouterState();
        if (state === null) {
            return;
        }
        const url = new URL((0, _addbasepath.addBasePath)(href), location.href);
        if ((0, _approuterutils.isExternalURL)(url)) {
            return;
        }
        // Fork the router state for the duration of the gesture transition.
        const currentUrl = new URL(state.canonicalUrl, location.href);
        const scrollBehavior = options?.scroll === false ? _routerreducertypes.ScrollBehavior.NoScroll : _routerreducertypes.ScrollBehavior.Default;
        // This is a special freshness policy that prevents dynamic requests from
        // being spawned. During the gesture, we should only show the cached
        // prefetched UI, not dynamic data.
        // TODO: In the case of navigations to an unknown route, this will still
        // end up performing a dynamic request. The plan is to do prefetch instead.
        // There's a separate TODO for this.
        const freshnessPolicy = _rendertree.FreshnessPolicy.Gesture;
        const forkedGestureState = (0, _approuterstate.navigate)(state, url, currentUrl, state.renderedSearch, state.root, state.tree, state.nextUrl, freshnessPolicy, scrollBehavior, 'push');
        (0, _useactionqueue.dispatchGestureState)(forkedGestureState);
    }
}
const publicAppRouterInstance = {
    back: ()=>window.history.back(),
    forward: ()=>window.history.forward(),
    prefetch: _prefetch.prefetchRoute,
    replace: _navigator.replace,
    push: _navigator.push,
    refresh: _navigator.refresh,
    hmrRefresh: _navigator.hmrRefresh,
    // Default value. Each route segment provides its own value at runtime. Refer
    // to `useRouter()`.
    bfcacheId: '0'
};
// Conditionally add experimental_gesturePush when gestureTransition is enabled
if (process.env.__NEXT_GESTURE_TRANSITION) {
    ;
    publicAppRouterInstance.experimental_gesturePush = gesturePush;
}
// Exists for debugging purposes. Don't use in application code.
if (typeof window !== 'undefined' && window.next) {
    window.next.router = publicAppRouterInstance;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-router-instance.js.map