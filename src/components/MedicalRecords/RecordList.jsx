import { useEffect, useState } from "react";
import {Link,useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'
import axios from 'axios'
const RecordList = () => {
    const[records,setRecords]=useState([]);
    const SubmitDelete=async(id)=>{
        await axios.delete(`http://localhost:8080/medical-records/${id}`).then(()=>{
           fetchRecords();
        })
    }
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Do you want to Delete?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              SubmitDelete(id);
              Swal.fire({
                icon: 'success',
                title: 'Record Deleted',
                showConfirmButton: false,
                timer: 1000
              })
            }
          })
    }
    const fetchRecords=async()=>{
        await axios.get('http://localhost:8080/medical-records').then((response)=>{
            setRecords(response.data);
        })
    }
    useEffect(() => {
     fetchRecords();
    }, [])
    const navigate=useNavigate();
    const backtoDashboard=()=>{
        navigate("/Dashboard")
    }
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-title">
                    <h2 className="text-center mt-2">Medical Records</h2>
                </div>
                <div className="card-body">
                    <div className="divbtn">
                        <Link to="/create" className="btn btn-success mt-4 mb-4">Add New (+)</Link>
                        <span className='back-btn' style={{marginLeft:"60rem"}} onClick={backtoDashboard}>Back to Dashboard</span>
                        
                    </div>
                    
                    <table className="table table-bordered table-striped ">
                        <thead>
                            <tr className="text-center">
                                <td>ID</td>
                                <td>Patient Id</td>
                                <td>Doctor Id</td>
                                <td>Date</td>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>

                            {records &&
                                records.map(record => (
                                    <tr key={record.id} className="text-center">
                                        <td>{record.id}</td>
                                        <td>{record.patientId}</td>
                                        <td>{record.doctorId}</td>
                                        <td>{record.date}</td>
                                        <td >
                                            <Link to={"/edit/"+record.id}><span className="edit-btn me-1">Edit</span></Link> 
                                            <span onClick={() => { handleDelete(record.id) }} className="back-btn me-1">Delete</span>
                                            <Link to={"/view/"+record.id}><span className="view-btn">View</span></Link>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default RecordList;