import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate,useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import Switch from 'react-switch'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify';
const MemberDetail = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Pending");
    const [membership,setMembership] = useState([]);
    const [renew, setRenew] = useState(false);
    const {id} = useParams();
    const [data,setData] = useState(null);
    const [planMember,setPlanMember] = useState("");

    useEffect(()=>{
        fetchData();
        fetchMembership();
        },[])

        const fetchMembership=async()=>{
            axios.get('https://gymsync-herc.onrender.com/plans/get-membership',{withCredentials:true}).then((response)=>{
setMembership(response.data.membership);
setPlanMember(response.data.membership[0]._id);
            }).catch(err=>{
                console.log(err)
                toast.error("Something went wrong")
            })
        }

        const fetchData=async()=>{
await axios.get(`https://gymsync-herc.onrender.com/members/get-member/${id}`,{withCredentials:true}).then((response)=>{
    console.log(response)
    setData(response.data.member);
    setStatus(response.data.member.status)
    toast.success(response.data.message)
}).catch(err=>{
    console.log(err);
    toast.error("Something Went Wrong");
})
        }

const handleSwitchBtn=async()=>{
    let statuss=status==="Active"?"Pending":"Active";
    await axios.post(`https://gymsync-herc.onrender.com/members/change-status/${id}`,{status:statuss},{withCredentials:true}).then((response)=>{
toast.success("Status Changed");
    }).catch(err=>{
        console.log(err);
        toast.error("Something went wrong");
    })
    setStatus(statuss);
}

const isDateInPast=(inputDate)=>{
    const today = new Date();
    const givenDate = new Date(inputDate);
    return givenDate < today;
};

const handleOnChangeSelect=(event)=>{
let value=event.target.value;
setPlanMember(value);
}
const handleRenewSaveBtn=async()=>{
    await axios.put(`https://gymsync-herc.onrender.com/members/update-member-plan/${id}`,{membership:planMember},{withCredentials:true}).then((response)=>{
setData(response.data.member);
toast.success(response.data.message);
    }).catch(err=>{
        console.log(err);
        toast.error("Something went wrong");
    })
}

  return (
    <div className='w-3/4 text-black p-5'>
    <div onClick={() => { navigate(-1) }} className='border-2 w-fit text-xl font-sans text-white p-2 rounded-xl bg-slate-900 cursor-pointer'>
<ArrowBackIcon/> Go Back
    </div>
    <div className='mt-10 p-2'>
<div className='w-[100%] h-fit flex'>
<div className='w-1/3 mx-auto '>
<img src= {data?.profilePic} className='w-full mx-auto' alt='profile pic'/>
</div>
<div className='w-2/3 mt-5 text-xl p-5'>
<div className='mt-1 mb-2 text-2xl font-semibold'>Name : {data?.name}</div>
<div className='mt-1 mb-2 text-2xl font-semibold'>Mobile : {data?.mobileNo}</div>
<div className='mt-1 mb-2 text-2xl font-semibold'>Address : {data?.address}</div>
<div className='mt-1 mb-2 text-2xl font-semibold'>Joined Date : {data?.createdAt.slice(0,10).split('-').reverse().join('-')}</div>
<div className='mt-1 mb-2 text-2xl font-semibold'>Next Bill Date : {data?.nextBillDate.slice(0,10).split('-').reverse().join('-')}</div>
<div className='mt-1 mb-2 flex gap-4 text-2xl font-semibold'>Status : <Switch onColor='#6366F1' checked={status==="Active"} onChange={() => { handleSwitchBtn() }} /></div>
{isDateInPast(data?.nextBillDate) && <div onClick={() => { setRenew(prev => !prev) }} className={`mt-1 rounded-lg p-3 border-2 border-slate-900 text-center ${renew && status === "Active" ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : null}  w-full md:w-1/2 cursor-pointer hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}>Renew</div>}
{
   renew && status==="Active"?(<div className='rounded-lg p-3 mt-5  mb-5 h-fit bg-slate-50 md:w-[100%]'>
    <div className='w-full'>
        <div className='my-5'>
            <div>Membership</div>
            <select value={planMember} onChange={handleOnChangeSelect} className='w-full border-2 p-2 rounded-lg'>
           {
            membership.map((item,index)=>{
                return (
                    <option value={item._id}>{item.months} Months Membership</option>
                )
            })
           }
           
            </select>
            <div className={`mt-3 rounded-lg p-3 border-2 border-slate-900 text-center w-1/2 mx-auto cursor-pointer hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 `} onClick={()=>{handleRenewSaveBtn()}}>Save</div>
        </div>
    </div>
</div>):null 
}
</div>
</div>

    </div>
    <ToastContainer/>
    </div>
  )
}

export default MemberDetail