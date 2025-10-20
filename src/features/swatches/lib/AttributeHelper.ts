export class AttributeHelper {
  static getImage(value: any) {
    const Image = value?.metadata?.Image || value?.metadata?.image;
    if (!Image) return undefined;

    const url = `https://preview.threekit.com${Image}`;

    return url;
  }

  static getValueLabel(attribute: any) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      'Unnamed'
    );
  }

  static getZoomIconColor(value: any) {
    return (
      value?.metadata?.zoomIconColor || value?.metadata?.zoomIconColor || null
    );
  }

  static getHexColor(value: any) {
    return value?.metadata?.hex || value?.metadata?.Hex || null;
  }

  static getAttributeLabel(attribute: any) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      'Unnamed'
    );
  }
}
