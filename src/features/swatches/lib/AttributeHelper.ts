export class AttributeHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getImage(value: any) {
    const Image = value?.metadata?.Image || value?.metadata?.image;
    if (!Image) return undefined;

    const url = `https://preview.threekit.com${Image}`;

    return url;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getValueLabel(attribute: any) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      'Unnamed'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getZoomIconColor(value: any) {
    return (
      value?.metadata?.zoomIconColor || value?.metadata?.zoomIconColor || null
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getHexColor(value: any) {
    return value?.metadata?.hex || value?.metadata?.Hex || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getAttributeLabel(attribute: any) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      'Unnamed'
    );
  }
}
