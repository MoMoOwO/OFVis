exports.getColor = (value) => {
    var r, g, b;
    if (value >= 0 & value <= 1 / 3) {
        r = 3 * value;
        g = 0;
        b = 0;
    } else if (value > 1 / 3 && value <= 2 / 3) {
        r = 0;
        g = 3 * (value - 1 / 3);
        b = 0;
    } else { // value >= 2/3 && value <= 1
        r = 0;
        g = 0;
        b = 3 * (value - 2 / 3);
    }

    return `RGB(${r},${g},${b})`;
}