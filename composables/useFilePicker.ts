import type { FileWithPath } from 'file-selector';
import { fromEvent } from 'file-selector';

import openFileDialog from '~/utils/open-file-dialog';

export type ReadType = 'Text' | 'BinaryString' | 'ArrayBuffer' | 'DataURL';

export type ReaderMethod = keyof FileReader;

export interface UseFilePickerConfig {
  multiple?: boolean;
  accept?: string | string[];
  readAs?: ReadType;
}

export interface FileContent {
  lastModified: number;
  name: string;
  content: string;
}

export const useFilePicker = ({
  multiple = false,
  accept = '*',
  readAs = 'Text',
}: UseFilePickerConfig) => {
  const files = ref<FileWithPath[]>([]);
  const filesContent = ref<FileContent[]>([]);
  const fileErrors = ref<DOMException[]>([]);
  const isLoading = ref(false);

  const openFileSelector = () => {
    const fileExtensions = accept instanceof Array ? accept.join(',') : accept;
    openFileDialog(fileExtensions, multiple, async (evt) => {
      clear();
      files.value = (await fromEvent(evt)) as FileWithPath[];
    });
  };

  const clear = () => {
    files.value = [];
    filesContent.value = [];
    fileErrors.value = [];
  };

  watch(files, async (value) => {
    if (!value.length) {
      filesContent.value = [];
      return;
    }

    isLoading.value = true;
    const fileParsingPromises = value.map(
      (file: FileWithPath) =>
        new Promise(
          (
            resolve: (fileContent: FileContent) => void,
            reject: (reason: DOMException | null) => void
          ) => {
            const reader = new FileReader();

            const readStrategy = reader[
              `readAs${readAs}` as ReaderMethod
            ] as typeof reader.readAsText;
            readStrategy.call(reader, file);

            reader.onload = () => {
              resolve({
                content: reader.result,
                name: file.name,
                lastModified: file.lastModified,
              } as FileContent);
            };

            reader.onerror = () => {
              reject(reader.error);
            };
          }
        )
    );

    try {
      filesContent.value = await Promise.all(fileParsingPromises);
    } catch (e: any) {
      fileErrors.value = e;
    } finally {
      isLoading.value = false;
    }
  });

  return {
    isLoading,
    openFileSelector,
    filesContent,
    files,
    clear,
  };
};
