import { ChangeEventHandler } from "react";

export type UploadButtonProps = {
  onUpload: ChangeEventHandler<HTMLInputElement>;
  loading: boolean;
};

const UploadButton = (props: UploadButtonProps): JSX.Element => {
  return (
    <div>
      <label className='btn btn-primary' htmlFor='single'>
        {props.loading ? "Ag Uaslódáil ..." : "Uaslódáil"}
      </label>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type='file'
        id='single'
        accept='image/*'
        onChange={props.onUpload}
        disabled={props.loading}
      />
    </div>
  );
};

export default UploadButton;
