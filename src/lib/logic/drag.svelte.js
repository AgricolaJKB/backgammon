export class DragManager {
    active = $state(false);
    snippet = $state(null);
    x = $state(0);
    y = $state(0);

    startX = 0;
    startY = 0;
    initialRect = null;
    maxDrag = [Infinity, Infinity];

    // Callback to notify the source component when drag ends
    onEndCallback = null;

    start(snippet, x, y, rect, onEnd, maxDrag = [Infinity, Infinity]) {
        this.active = true;
        this.snippet = snippet;
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.initialRect = rect;
        this.onEndCallback = onEnd;
        this.maxDrag = maxDrag;

        this.addListeners();
    }

    addListeners() {
        window.addEventListener('mousemove', this.handleMove);
        window.addEventListener('mouseup', this.handleEnd);
        window.addEventListener('touchmove', this.handleMove, {passive: false});
        window.addEventListener('touchend', this.handleEnd);
    }

    removeListeners() {
        window.removeEventListener('mousemove', this.handleMove);
        window.removeEventListener('mouseup', this.handleEnd);
        window.removeEventListener('touchmove', this.handleMove);
        window.removeEventListener('touchend', this.handleEnd);
    }

    handleMove = (e) => {
        let clientX, clientY;
        if (e.type.startsWith('touch')) {
            // e.preventDefault(); // Prevent scrolling while dragging?
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return;
            }
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        this.move(clientX, clientY);
    };

    handleEnd = () => {
        this.end();
    };

    move(x, y) {
        if (!this.active) return;
        this.x = x;
        this.y = y;

        const deltaX = Math.abs(this.x - this.startX);
        const deltaY = Math.abs(this.y - this.startY);

        if (deltaX > this.maxDrag[0] || deltaY > this.maxDrag[1]) {
            this.end();
        }
    }

    end() {
        if (!this.active) return;

        this.removeListeners();

        const finalX = this.x;
        const finalY = this.y;

        // Calculate center
        let center = {x: finalX, y: finalY};
        if (this.initialRect) {
            const deltaX = finalX - this.startX;
            const deltaY = finalY - this.startY;
            const currentLeft = this.initialRect.left + deltaX;
            const currentTop = this.initialRect.top + deltaY;
            center = {
                x: currentLeft + this.initialRect.width / 2,
                y: currentTop + this.initialRect.height / 2,
            };
        }

        if (this.onEndCallback) {
            this.onEndCallback(center);
        }

        this.active = false;
        this.snippet = null;
        this.initialRect = null;
        this.onEndCallback = null;
    }

    get currentPosition() {
        if (!this.initialRect) return {top: 0, left: 0};
        const deltaX = this.x - this.startX;
        const deltaY = this.y - this.startY;
        return {
            top: this.initialRect.top + deltaY,
            left: this.initialRect.left + deltaX,
            width: this.initialRect.width,
            height: this.initialRect.height,
        };
    }
}

export const dragManager = new DragManager();
