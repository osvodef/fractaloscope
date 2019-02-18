import { Scope } from '../Scope';
import { Vec2 } from '../vec2';

export class MouseZoom {
    private scope: Scope;

    constructor(scope: Scope) {
        this.scope = scope;
        this.scope.getContainer().addEventListener('wheel', this.onWheel);
    }

    private onWheel = (e: MouseWheelEvent): void => {
        e.preventDefault();

        const zoomPoint = new Vec2(e.clientX, e.clientY);
        const pointBeforeZoom = this.scope.unproject(zoomPoint);
        this.scope.setZoom(this.scope.getZoom() + this.getDelta(e));
        const pointAfterZoom = this.scope.unproject(zoomPoint);

        const newCenter = this.scope.getCenter()
            .add(pointBeforeZoom)
            .sub(pointAfterZoom);

        this.scope.setCenter(newCenter);
    }

    private getDelta(e: MouseWheelEvent): number {
        if (e.ctrlKey) {
            return -e.deltaY * 0.025;
        }

        if (e.deltaMode === 1) {
            return -e.deltaY * 0.25;
        }

        return -e.deltaY * 0.0025;
    }
}
