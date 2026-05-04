import React, { useState } from 'react';
import { CrudMaster } from './CrudMaster';
import { useMastersStore } from '../../store/mastersStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { newRequest } from '../../api';
import { AREAS, BRANCH_DROPDOWN } from '../../api/apis';
import useApiMaster from '../../hooks/useApiMasters';
import { usePopup } from '../../providers/PopupProvider';
import toast from 'react-hot-toast';

export function AreasMaster() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess } = usePopup();

  const { areas, branches, addArea, updateArea, deleteArea } = useMastersStore();

  const { data: areaMasterList, isLoading, isError } = useQuery({
    queryKey: ["areaMasterList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(AREAS, {
          params: {
            keyword,
            page: currentPage,
            limit: pageLimit,
          },
        })
        .then((res) => res.data),
  });
  const { data: branchDropdown } = useApiMaster(
    BRANCH_DROPDOWN,
    "branchDropdown",
  );

  const columns = [
    { key: 'name', label: 'Area Name' },
    {
      key: 'branchId',
      label: 'Branch',
      render: (branchId) => branchDropdown?.data?.find(b => b.value === Number(branchId))?.label || 'Unknown'
    }
  ];

  const formFields = [
    { name: 'name', label: 'Area Name', type: 'text', required: true },
    {
      name: 'branchId',
      label: 'Branch',
      type: 'select',
      required: true,
      options: branchDropdown?.data || []
    }
  ];

  const handleSave = async (data, id) => {
    try {
      setLoader(true);
      const payload = { ...data, branchId: Number(data.branchId) };
      const api = id ? `${AREAS}/${id}` : AREAS
      const method = id ? 'patch' : 'post'
      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        setLoader(false);
        if (id) {
          toast.success(res?.data?.message);
        } else {
          showSuccess(res?.data?.message);
        }
        queryClient.invalidateQueries(["areaMasterList"]);
        return true;
      }
      setLoader(false);
      return false;
    } catch (error) {
      setLoader(false);
      console.log(error);
      setErrormsg(error?.response?.data?.error || "Something went wrong");
      setErrorPopup(true);
      return false;
    }
  };

  return (
    <CrudMaster
      title="Areas"
      columns={columns}
      data={areaMasterList?.data || []}
      formFields={formFields}
      onSave={handleSave}
      api={AREAS}
      loader={loader}
      isLoading={isLoading}
      isError={isError}
      queryKey="areaMasterList"
      pagination={true}
      currentPage={currentPage}
      totalPages={areaMasterList?.pagination?.totalPage || 1}
      totalItems={areaMasterList?.pagination?.totalData || 0}
      onPageChange={(page) => setCurrentPage(page)}
      keyword={keyword}
      setKeyword={setKeyword}
    />
  );
}
