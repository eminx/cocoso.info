"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "io", {
    enumerable: true,
    get: function() {
        return io;
    }
});
const _workasyncstorageexternal = require("../app-render/work-async-storage.external");
const _workunitasyncstorageexternal = require("../app-render/work-unit-async-storage.external");
const _dynamicrendering = require("../app-render/dynamic-rendering");
const _stagedrendering = require("../app-render/staged-rendering");
const _dynamicrenderingutils = require("../dynamic-rendering-utils");
const _synciomessages = require("../app-render/sync-io-messages");
const _invarianterror = require("../../shared/lib/invariant-error");
function io(expression, type) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (!workUnitStore || !workStore) {
        return;
    }
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
            {
                const prerenderSignal = workUnitStore.controller.signal;
                if (prerenderSignal.aborted === false) {
                    // If the prerender signal is already aborted we don't need to construct
                    // any stacks because something else actually terminated the prerender.
                    // TODO: synchronize this with `stageController`
                    (0, _dynamicrendering.abortOnSynchronousPlatformIOAccess)(workStore.route, expression, (0, _dynamicrenderingutils.applyOwnerStack)((0, _synciomessages.createSyncIOError)(workStore.route, expression, type)), workUnitStore);
                }
                break;
            }
        case 'prerender-client':
            {
                const prerenderSignal = workUnitStore.controller.signal;
                if (prerenderSignal.aborted === false) {
                    // If the prerender signal is already aborted we don't need to construct
                    // any stacks because something else actually terminated the prerender.
                    (0, _dynamicrendering.abortOnSynchronousPlatformIOAccess)(workStore.route, expression, (0, _dynamicrenderingutils.applyOwnerStack)((0, _synciomessages.createSyncIOClientError)(workStore.route, expression, type)), workUnitStore);
                }
                break;
            }
        case 'request':
            {
                const stageController = workUnitStore.stagedRendering;
                if (stageController && stageController.shouldTrackSyncInterrupt()) {
                    let syncIOError;
                    // NOTE: keep stages where we can interrupt in sync with
                    // `shouldTrackSyncInterrupt`/`syncInterruptCurrentStageWithReason`
                    switch(stageController.currentStage){
                        case _stagedrendering.RenderStage.ShellStatic:
                        case _stagedrendering.RenderStage.PrefetchStatic_prefetchApi:
                        case _stagedrendering.RenderStage.PrefetchStatic:
                        case _stagedrendering.RenderStage.NavigationStatic:
                        case _stagedrendering.RenderStage.Static:
                            {
                                syncIOError = (0, _synciomessages.createSyncIOError)(workStore.route, expression, type);
                                break;
                            }
                        case _stagedrendering.RenderStage.ShellRuntime:
                        case _stagedrendering.RenderStage.PrefetchRuntime_prefetchApi:
                        case _stagedrendering.RenderStage.PrefetchRuntime:
                        case _stagedrendering.RenderStage.NavigationRuntime:
                            {
                                // We're in a runtime stage.
                                // We only error for Sync IO in runtime stages if the route has partialPrefetching enabled.
                                syncIOError = (0, _synciomessages.createSyncIORuntimeError)(workStore.route, expression, type);
                                break;
                            }
                        case _stagedrendering.RenderStage.Before:
                        case _stagedrendering.RenderStage.Dynamic:
                        case _stagedrendering.RenderStage.Abandoned:
                            {
                                throw new _invarianterror.InvariantError(`shouldTrackSyncInterrupt allowed a sync IO interrupt in an unexpected stage: ${_stagedrendering.RenderStage[stageController.currentStage]}`);
                            }
                    }
                    syncIOError = (0, _dynamicrenderingutils.applyOwnerStack)(syncIOError);
                    stageController.syncInterruptCurrentStageWithReason(syncIOError);
                    // A validation render uses a 'request' store type, but may be abortable.
                    // If we're rendering with filled caches, Sync IO is an error and should trigger an abort.
                    if (workUnitStore.controller && !workUnitStore.controller.signal.aborted) {
                        workUnitStore.controller.abort(syncIOError);
                    }
                }
                break;
            }
        case 'validation-client':
        case 'prerender-legacy':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
            break;
        default:
            workUnitStore;
    }
}

//# sourceMappingURL=io-utils.js.map