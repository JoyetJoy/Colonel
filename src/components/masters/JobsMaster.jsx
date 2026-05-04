import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CrudMaster } from './CrudMaster';
import { useMastersStore } from '../../store/mastersStore';
import { newRequest } from '../../api';
import { BRANCH_DROPDOWN, JOBS } from '../../api/apis';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useApiMaster from '../../hooks/useApiMasters';
import ErrorPopup from '../popups/ErrorPopup';
import { usePopup } from '../../providers/PopupProvider';
import toast from 'react-hot-toast';

export function JobsMaster() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess } = usePopup();



  const { data: jobMasterList, isLoading, isError } = useQuery({
    queryKey: ["jobMasterList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(JOBS, {
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
    { key: 'name', label: 'Job Name' },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <div
          className="max-w-xs max-h-16 overflow-hidden text-ellipsis prose prose-sm"
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      )
    },
    {
      key: 'branchId',
      label: 'Branch',
      render: (branchId) => branchDropdown?.data?.find(b => b.value === Number(branchId))?.label || 'Unknown'
    }
  ];

  const formFields = [
    { name: 'name', label: 'Job Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'richtext', required: true },
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
      const api = id ? `${JOBS}/${id}` : JOBS
      const method = id ? 'patch' : 'post'
      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        setLoader(false);
        if (id) {
          toast.success(res?.data?.message);
        } else {
          showSuccess(res?.data?.message);
        }

        queryClient.invalidateQueries(["jobMasterList"]);
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
        title="Jobs"
        loader={loader}
        isLoading={isLoading}
        isError={isError}
        columns={columns}
        data={jobMasterList?.data || []}
        api={JOBS}
        keyword={keyword}
        setKeyword={setKeyword}
        queryKey={"jobMasterList"}
        formFields={formFields}
        onSave={handleSave}
        pagination={true}
        currentPage={currentPage}
        totalPages={jobMasterList?.pagination?.totalPage || 1}
        totalItems={jobMasterList?.pagination?.totalData || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}
