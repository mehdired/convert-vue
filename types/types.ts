export type ConvertedImage = {
  name: string;
  url: string;
};

export type ConversionResult = {
  convertedImages?: ConvertedImage[];
  zipUrl?: string | null;
  error?: string;
};
