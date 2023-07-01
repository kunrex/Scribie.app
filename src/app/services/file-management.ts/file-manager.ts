import { Injectable } from "@angular/core";
import { Directory, FileInfo, Filesystem } from "@capacitor/filesystem";

import { Initilaisiable } from "src/app/initilizable";

@Injectable()
export abstract class FileManager extends Initilaisiable {
  constructor() {
    super();
   }

  protected async readAllFiles(onFileReadCallback: (name: string, value: string) => void) : Promise<void> {
    await Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(async result => {
      
      const loaded: FileInfo[] = result.files;

      for(var i: number = 0; i < loaded.length; i++) {
        var current = loaded[i];
        var value: string = atob((await Filesystem.readFile({
          path: current.uri
        })).data);

        onFileReadCallback(current.name, value);
      }
    });
  }

  protected async addFile(fileName: string, data: any) : Promise<boolean> {
    const json = JSON.stringify(data);

    await Filesystem.writeFile({
      path: fileName,
      directory: Directory.Data,
      data: btoa(json),
    });

    return true;
  }

  protected async renameFile(old: string, newName: string) : Promise<boolean> {
    await Filesystem.rename({
      from: old,
      to: newName,
      directory: Directory.Data
    });
    
    return false;
  }

  protected async deleteFile(name: string) : Promise<boolean> {
    await Filesystem.deleteFile({
      path: name,
      directory: Directory.Data
    });

    return true;
  }
}