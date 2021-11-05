/* eslint-disable class-methods-use-this, no-empty-function, no-unused-vars */
import { Observable } from 'rxjs';



interface Adapter {
  delegate: (event: string, namespace: string) => Observable<any>;
}

export default Adapter;
