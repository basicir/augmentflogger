const decodeId = (base64Id: string) => {
  if (!base64Id) return base64Id;
  try {
    const decoded = atob(base64Id);
    const match = decoded.match(/--(\d+)$/);
    return match ? match[1] : base64Id;
  } catch (e) {
    return base64Id;
  }
};
console.log(decodeId('VXNlclByb2dyYW0tLTUzODA4MA=='))
console.log(decodeId('not-base64-at-all'))
