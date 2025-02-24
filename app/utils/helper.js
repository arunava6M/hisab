export const getRandomColor = (light = false) => {
  if (light) {
    // Generate a light color by keeping RGB values in the range (150-255)
    const r = Math.floor(Math.random() * 106) + 150; // 150-255
    const g = Math.floor(Math.random() * 106) + 150; // 150-255
    const b = Math.floor(Math.random() * 106) + 150; // 150-255
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Standard random hex color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
};

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

export const getInitial = (str) => str[0];

export const getColorFromValue = (value) => {
  let finalColor;
  switch (true) {
    case value > 50 && value < 65:
      finalColor = '#e38424';
      break;
    case value > 65:
      finalColor = '#e32444';
      break;
    default:
      finalColor = 'green';
  }
  return finalColor;
};
