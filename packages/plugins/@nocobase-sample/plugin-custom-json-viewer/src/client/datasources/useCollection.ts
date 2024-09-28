import { useCollection, useDataBlockRequest } from "@nocobase/client";

export function useCollectionFn(props) {

  const collection = useCollection();
  const { data, loading } = useDataBlockRequest<any[]>();

  return {
    collectionName: collection.name,
    data: data?.data,
    loading: loading,
    ...props
  }
}
