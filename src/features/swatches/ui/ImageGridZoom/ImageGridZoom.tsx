import { useState } from 'react';
// import { Maximize2 } from 'lucide-react';
import { AttributeHelper } from '../../lib/AttributeHelper';
// import { DarkWhiteIconSVG } from '../../../../app/assets/svg/DarkWhiteIconSVG';
// import { WhiteWhiteIconSVG } from '../../../../app/assets/svg/WhiteWhiteIconSVG';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../shared/ui/Dialog/Dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImageGridZoom = ({ item }: { item: any }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [zoomSrc, _] = useState<string | undefined>('');
  const [open, setOpen] = useState(false);

  const imageUrl = AttributeHelper.getImage(item);
  const valueLabel = AttributeHelper.getValueLabel(item);
  // const zoomIconColor = AttributeHelper.getZoomIconColor(item);

  // const getZoomIcon = (zoomIconColor: string) => {
  //   if (!zoomIconColor)
  //     return <Maximize2 className='w-5 h-5 sm:w-6 sm:h-6 shrink-0' />;

  //   if (zoomIconColor === 'Dark Grey') {
  //     return <DarkWhiteIconSVG className='w-5 h-5 sm:w-6 sm:h-6' />;
  //   }
  //   if (zoomIconColor === 'White') {
  //     return <WhiteWhiteIconSVG className='w-5 h-5 sm:w-6 sm:h-6' />;
  //   }
  // };

  return (
    <>
      <div className='group relative w-full h-full aspect-video overflow-hidden shadow-sm group cursor-pointer rounded-sm'>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={valueLabel}
            className='w-full h-full object-cover'
            loading='lazy'
          />
        )}

        {/* <div
          className='sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto absolute top-2 right-2 p-[0.4rem] sm:p-2 rounded-full transition'
          onClick={(e) => {
            e.stopPropagation();
            setZoomSrc(imageUrl);
            setOpen(true);
          }}
          role='button'
          tabIndex={0}
        >
          {getZoomIcon(zoomIconColor)}
        </div> */}
      </div>

      <Dialog
        open={!!open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <DialogContent
          className='sm:max-w-5xl'
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className='sr-only'>Image Zoom</DialogTitle>
          </DialogHeader>
          <img src={zoomSrc} alt='Zoomed' className='w-full h-auto' />
          {valueLabel && (
            <span className='text-white mt-2 block'>
              {(item?.metadata?.Finish || item?.metadata?.Material) &&
                `${item.metadata?.Finish || item.metadata?.Material} | `}
              {valueLabel}
            </span>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
