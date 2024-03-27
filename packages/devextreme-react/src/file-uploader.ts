"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFileUploader, {
    Properties
} from "devextreme/ui/file_uploader";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { BeforeSendEvent, ContentReadyEvent, DisposingEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, InitializedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, ValueChangedEvent } from "devextreme/ui/file_uploader";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFileUploaderOptionsNarrowedEvents = {
  onBeforeSend?: ((e: BeforeSendEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
  onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
  onFilesUploaded?: ((e: FilesUploadedEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onProgress?: ((e: ProgressEvent) => void);
  onUploadAborted?: ((e: UploadAbortedEvent) => void);
  onUploaded?: ((e: UploadedEvent) => void);
  onUploadError?: ((e: UploadErrorEvent) => void);
  onUploadStarted?: ((e: UploadStartedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IFileUploaderOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFileUploaderOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>

interface FileUploaderRef {
  instance: () => dxFileUploader;
}

const FileUploader = memo(
  forwardRef(
    (props: React.PropsWithChildren<IFileUploaderOptions>, ref: ForwardedRef<FileUploaderRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onBeforeSend","onContentReady","onDisposing","onDropZoneEnter","onDropZoneLeave","onFilesUploaded","onInitialized","onProgress","onUploadAborted","onUploaded","onUploadError","onUploadStarted","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IFileUploaderOptions>>, {
          WidgetClass: dxFileUploader,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IFileUploaderOptions> & { ref?: Ref<FileUploaderRef> }) => ReactElement | null;
export default FileUploader;
export {
  FileUploader,
  IFileUploaderOptions,
  FileUploaderRef
};
import type * as FileUploaderTypes from 'devextreme/ui/file_uploader_types';
export { FileUploaderTypes };

