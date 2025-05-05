class Sprite {
  constructor({
    position,
    image,
    // hold is for the frames per second (frames before animating)
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    context = ctx,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.context = context;
  }

  draw() {
    // global properties affect the context content btw save and restore()
    this.context.save();
    this.context.globalAlpha = this.opacity;
    this.context.drawImage(
      // 192*68 is the dimension of the player png (192/4 = 48)
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    this.context.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold == 0) {
      // as there are only 4 frames available, so we want the frames.val to be 0,1,2
      // in this manner, for val = 2, we increased the frame three times (iterating the fourth sprite also)
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Boundary {
  // initially we used a 12*12 px tileset, but we imported the map with 400% zoom
  // that increased the tileset image to 12*4 = 48px

  // 16*16 px tileset, and imported as 275% zoom, so the tileset image would be 44px
  static width = 44;
  static height = 44;

  constructor({ position, isMaze, ctx }) {
    this.position = position;
    this.ctx = ctx;

    // Set static values based on isMaze condition
    Boundary.width = isMaze ? 48 : 44;
    Boundary.height = isMaze ? 48 : 44;

    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    this.ctx.fillStyle = "rgba(255,0,0,0)";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
