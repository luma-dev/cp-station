import { useParams } from 'react-router-dom';

export const useFolderId = () => {
  const { folderId } = useParams();
  return folderId ?? '';
};
