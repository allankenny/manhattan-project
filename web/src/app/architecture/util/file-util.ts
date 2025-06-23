export class FileUtil {

  protected static readonly EXTENSIONS_NOT_PERMITTED: string[] = ['.exe', '.msg', '.rar', '.zip'];
  protected static readonly EXTENSIONS_IMAGE_PERMITTED: string[] = ['.png', '.jpg', '.jpeg'];


  public static isExtensionPermitted(fileName: string): boolean {
    fileName = fileName.toLowerCase();
    for (const extension of FileUtil.EXTENSIONS_NOT_PERMITTED) {
      if (fileName.endsWith(extension)) {
        return false;
      }
    }
    return true;
  }

  public static isExtensionImagePermitted(fileName: string): boolean {
    fileName = fileName.toLowerCase();
    for (const extension of FileUtil.EXTENSIONS_IMAGE_PERMITTED) {
      if (fileName.endsWith(extension)) {
        return true;
      }
    }
    return false;
  }

}
