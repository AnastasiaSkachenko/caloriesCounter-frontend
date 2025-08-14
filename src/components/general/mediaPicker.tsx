import React, { useState } from 'react'
import { baseImageUrl } from '../../utils/production';
import Button from '../../customComponents/Button';

interface MediaPickerProps {
  media?: (File | string)[],
  mediaChange: (media: (File | string)[]) => void,
  setMediaToDelete: (media_to_delete: string[]) => void
}

const MediaPicker: React.FC<MediaPickerProps> = ({media, mediaChange, setMediaToDelete}) => {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; name: string; type: "image" | "video" | null } | null>(null);
  const [mediaList, setMediaList] = useState<(File | string)[]>(media ?? [])
  const [toDelete, setToDelete] = useState<string[]>([])

  const handleOpenModal = (media: string | File) => {
    let url: string;
    let name: string;
    let type: "image" | "video" | null = null;

    if (typeof media === "string") {
      // From backend
      url = baseImageUrl + media;
      name = media.split("_media/").pop() || "Unknown file";
    } else {
      // From user upload (local File)
      url = URL.createObjectURL(media);
      name = media.name;
    }

    if (name.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      type = "image";
    } else if (name.match(/\.(mp4|webm|ogg)$/i)) {
      type = "video";
    }

    setSelectedMedia({ url, name, type });
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };

    if (target.files) {
      const filesArray = Array.from(target.files); // Convert FileList to array
      const newMediaList = [...mediaList, ...filesArray]

      setMediaList(newMediaList);
      mediaChange(newMediaList)
    }
  };

  const handleDeleteMedia = (index: number) => {
    const mediaToRemove = typeof mediaList[index] === "string" 
      ? mediaList[index] 
      : mediaList[index].name;

    // Update local media list
    const updatedMediaList = mediaList.filter((_, i) => i !== index);
    setMediaList(updatedMediaList);

    // Update parent about deleted media
    const updatedToDelete = [...toDelete, mediaToRemove]
    setToDelete(updatedToDelete);
    setMediaToDelete(updatedToDelete)
  };
  

  return (
    <div>
      <label className='form-label full-length-label my-2'>
        <input 
          className="form-control form-control-file form-control-sm"  
          type="file" id="formFileMultiple" 
          onChange={(e) => handleMediaChange(e)} multiple 
          />
      </label>
      {mediaList.map((media, index) => (
        <div key={index} className='d-flex justify-content-between align-items-center my-1'>
          <Button
            text={typeof media === "string" ? media.split("_media/")[1] : media.name}
            variant='link'
            key={index} 
            onClick={() => handleOpenModal(media)}
            textAlign='start'
            textColor='black'
            style={{maxWidth: 400 }}
            className='text-truncate'
          />
          <Button icon="bi bi-trash-fill" onClick={() => handleDeleteMedia(index)} style={{height: 45, width: 20}} />
        </div>

      ))}

      {selectedMedia && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Preview ({selectedMedia.name})
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body d-flex justify-content-center">
                {selectedMedia.type === "image" && (
                  <img src={selectedMedia.url} alt="Media Preview" className="img-fluid" style={{ height: 500 }} />
                )}
                {selectedMedia.type === "video" && (
                  <video src={selectedMedia.url} controls className="w-100" style={{ height: 500 }} />
                )}
                {!selectedMedia.type && <p>Preview not available for this file type.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaPicker
