import React, { useState } from 'react';
import { CrudMaster } from './CrudMaster';
import { useMastersStore } from '../../store/mastersStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { newRequest } from '../../api';
import useApiMaster from '../../hooks/useApiMasters';
import { BRANCH_DROPDOWN, DESIGNATIONS } from '../../api/apis';
import ErrorPopup from '../popups/ErrorPopup';
import { usePopup } from '../../providers/PopupProvider';
import toast from 'react-hot-toast';

export function DesignationsMaster() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess } = usePopup();

  const { designations, branches, addDesignation, updateDesignation, deleteDesignation } = useMastersStore();

  const { data: designationMasterList, isLoading, isError } = useQuery({
    queryKey: ["designationMasterList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(DESIGNATIONS, {
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
    { key: 'name', label: 'Designation Name' },
    {
      key: 'branchId',
      label: 'Branch',
      render: (branchId) => branchDropdown?.data?.find(b => b.value === Number(branchId))?.label || 'Unknown'
    }
  ];

  const formFields = [
    { name: 'name', label: 'Designation Name', type: 'text', required: true },
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
      const api = id ? `${DESIGNATIONS}/${id}` : DESIGNATIONS
      const method = id ? 'patch' : 'post'
      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        setLoader(false);
        if (id) {
          toast.success(res?.data?.message);
        } else {
          showSuccess(res?.data?.message);
        }

        queryClient.invalidateQueries(["designationMasterList"]);
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
    <>
      <ErrorPopup
        popupOpen={errorPopup}
        setPopupOpen={setErrorPopup}
        setError={setErrormsg}
        error={errormsg}
      />
      <CrudMaster
        title="Designations"
        columns={columns}
        loader={loader}
        isLoading={isLoading}
        isError={isError}
        data={designationMasterList?.data || []}
        formFields={formFields}
        onSave={handleSave}
        api={DESIGNATIONS}
        queryKey="designationMasterList"
        pagination={true}
        currentPage={currentPage}
        totalPages={designationMasterList?.pagination?.totalPage || 1}
        totalItems={designationMasterList?.pagination?.totalData || 0}
        onPageChange={(page) => setCurrentPage(page)}
        keyword={keyword}
        setKeyword={setKeyword}
      />
    </>
  );
}
