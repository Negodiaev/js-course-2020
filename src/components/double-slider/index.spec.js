import DoubleSlider from './index.js';

describe("DoubleSlider", () => {
  let doubleSlider;

  beforeEach(() => {
    doubleSlider = new DoubleSlider({
      min: 100,
      max: 200,
      formatValue: value => '$' + value,
      selected: {
        from: 120,
        to: 150
      }
    });

    // doubleSlider.elem.style.width = '100px';
    document.body.append(doubleSlider.elem);
  });

  afterEach(() => {
    doubleSlider.destroy();
    doubleSlider = null;
  });

  it("should be rendered correctly", () => {
    expect(doubleSlider.elem).toBeInTheDocument();
    expect(doubleSlider.elem).toBeVisible();
  });

  it("should have ability to set slider boundaries", () => {
    doubleSlider = new DoubleSlider({
      min: 400,
      max: 600,
      formatValue: value => '$' + value,
    });

    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    expect(leftBoundary).toHaveTextContent("$400");
    expect(rightBoundary).toHaveTextContent("$600");
  });

  it('should have ability to set selected range', () => {
    doubleSlider = new DoubleSlider({
      min: 300,
      max: 800,
      selected: {
        from: 200,
        to: 400
      },
      formatValue: value => '$' + value,
    });

    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    expect(leftBoundary).toHaveTextContent("$200");
    expect(rightBoundary).toHaveTextContent("$400");
  });

  it('should have ability to move left slider to start boundary', () => {
    const leftSlider = doubleSlider.elem.querySelector('.range-slider__thumb-left');
    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: -1,
      bubbles: true
    });

    leftSlider.dispatchEvent(down);
    leftSlider.dispatchEvent(move);

    expect(leftBoundary).toHaveTextContent(doubleSlider.min);
  });

  it('should have ability to move right slider to end boundary', () => {
    const rightSlider = doubleSlider.elem.querySelector('.range-slider__thumb-right');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 1,
      bubbles: true
    });

    rightSlider.dispatchEvent(down);
    rightSlider.dispatchEvent(move);

    expect(rightBoundary).toHaveTextContent(doubleSlider.max);
  });

  it('should have ability to select all range', () => {
    const leftSlider = doubleSlider.elem.querySelector('.range-slider__thumb-left');
    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');
    const rightSlider = doubleSlider.elem.querySelector('.range-slider__thumb-right');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const moveRight = new MouseEvent('pointermove', {
      clientX: 1,
      bubbles: true
    });

    const moveLeft = new MouseEvent('pointermove', {
      clientX: -1,
      bubbles: true
    });

    leftSlider.dispatchEvent(down);
    leftSlider.dispatchEvent(moveLeft);

    rightSlider.dispatchEvent(down);
    rightSlider.dispatchEvent(moveRight);

    expect(leftBoundary).toHaveTextContent(doubleSlider.min);
    expect(rightBoundary).toHaveTextContent(doubleSlider.max);
  });

  it('should have ability to select single value (when min and max range equal)', () => {
    const leftSlider = doubleSlider.elem.querySelector('.range-slider__thumb-left');
    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 1,
      bubbles: true
    });

    leftSlider.dispatchEvent(down);
    leftSlider.dispatchEvent(move);

    expect(leftBoundary.textContent.trim()).toEqual(rightBoundary.textContent.trim());
  });

  it('should have ability to set range value, for example: usd, eur, etc.', () => {
    doubleSlider = new DoubleSlider({
      min: 100,
      max: 200,
      formatValue: value => 'USD' + value
    });

    const leftBoundary = doubleSlider.elem.querySelector('span[data-elem="from"]');
    const rightBoundary = doubleSlider.elem.querySelector('span[data-elem="to"]');

    expect(leftBoundary.textContent.trim()).toContain('USD');
    expect(rightBoundary.textContent.trim()).toContain('USD');
  });

  it('should produce event "range-select"', () => {
    const spyDispatchEvent = jest.spyOn(doubleSlider.elem, 'dispatchEvent');
    const leftSlider = doubleSlider.elem.querySelector('.range-slider__thumb-left');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 1,
      bubbles: true
    });

    const up = new MouseEvent('pointerup', {
      bubbles: true
    });

    leftSlider.dispatchEvent(down);
    leftSlider.dispatchEvent(move);
    leftSlider.dispatchEvent(up);

    const [rangeMoveEvent, rangeSelectEvent] = spyDispatchEvent.mock.calls;

    expect(rangeMoveEvent[0].type).toEqual("range-move");
    expect(rangeSelectEvent[0].type).toEqual("range-select");
  });

  it('should have a new ranges in produced event', () => {
    const spyDispatchEvent = jest.spyOn(doubleSlider.elem, 'dispatchEvent');
    const leftSlider = doubleSlider.elem.querySelector('.range-slider__thumb-left');

    const down = new MouseEvent('pointerdown', {
      bubbles: true
    });

    const move = new MouseEvent('pointermove', {
      clientX: 1,
      bubbles: true
    });

    leftSlider.dispatchEvent(down);
    leftSlider.dispatchEvent(move);

    const customEvent = spyDispatchEvent.mock.calls[0][0];

    expect(spyDispatchEvent).toHaveBeenCalled();
    expect(customEvent.detail).toEqual({ from: 150, to: 150 });
  });

  it('should have ability to be destroyed', () => {
    doubleSlider.destroy();

    expect(doubleSlider.elem).not.toBeInTheDocument();
  });
});
