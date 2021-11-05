import { Subject, fromEvent, EMPTY, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import type Adapter from "./Adapter";
import type { framework } from "chromecast-caf-receiver";
import type {
  TrackType,
  ErrorType,
  StreamType,
} from "chromecast-caf-receiver/cast.framework.messages";
import type {
  DetailedErrorCode,
  EventType,
  Event,
  ErrorEvent,
} from "chromecast-caf-receiver/cast.framework.events";

/**
 * @extends Adapter
 */
class CastAdapter implements Adapter {
  private _player: framework.PlayerManager;
  private _adsPlaying = false;

  constructor(public readonly cast: any) {
    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager() as framework.PlayerManager;
    this._player = playerManager;
  }

  delegate(event: string, namespace: string) {
    const event$ = this._getEventObservable(`${namespace}.${event}`);
    return namespace === "media"
      ? event$.pipe(filter(() => !this._adsPlaying))
      : event$;
  }

  private _getEventObservable(event: string) {
    const player = this._player;

    switch (event) {
      case "media.error":
        return fromEvent(player, EventType.ERROR).pipe(
          filter((err) => err.type !== ErrorType.LOAD_CANCELLED),
          map((err) => console.log(err.detailedErrorCode))
        );
      default:
        return EMPTY;
    }
  }
}

export default CastAdapter;
