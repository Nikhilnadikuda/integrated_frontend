import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./style.css"
const CreateRecord = () => {
    const [patientId, setPatientId] = useState('')
    const [doctorId, setDoctorId] = useState('')
    const [diagnosis, setDiagnosis] = useState('')
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('')
    const [prescription, setPrescription] = useState('')
    const [error, setError] = useState("")
    const [checkValid, setCheckValid] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        var formattedDate;
        if(date) {formattedDate = new Date(date).toISOString().split('T')[0];}
        const record = {
            patientId: patientId,
            doctorId: doctorId,
            date: formattedDate,
            diagnosis: diagnosis,
            prescription: prescription,
            notes: notes
        }
        await axios.post('http://localhost:8080/medical-records', record).then((response) => {
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Record Added',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/Dashboard/emr');
        })
    }
    const validate = async () => {
        var a = false, b = false;
        if (patientId.length !== 0 && doctorId.length !== 0) {
            await axios.get(`http://localhost:8080/patient/${parseInt(patientId)}`).then((response) => {
                if (!response.data) {
                    a = false;
                    console.log("Patient not found with id : " + patientId);
                }
                else {
                    a = true;
                    console.log("Patient found with id : " + patientId)
                }
            })
            await axios.get(`http://localhost:8080/staff/doctor/${doctorId}`).then((response) => {
                console.log(response);
                if (!response.data) {
                    b = false;
                    console.log("Doctor not found with id : " + doctorId);
                }
                else {
                    b = true;
                    console.log("Doctor found with id : " + doctorId)
                }
            })
            if (a === true && b === false) {
                setError("Invalid Doctor Id : " + doctorId);
            }
            else if (a === false && b === false) {
                setError("Invalid Doctor Id and Patient Id");
            }
            else if (a === false && b === true) {
                setError("Invalid Patient Id : " + patientId);
            }
            setCheckValid((a === true && b === true) ? true : false);
        }
        else {
            return;
        }

    }
    const Back=()=>{
        navigate("/Dashboard/emr")
    }
    return (
        <div className="mt-4">
            <div className="row">
                <div className="offset-lg-3 col-lg-6">
                    <form className="container" onSubmit={handleSubmit}>
                        <div className="card" style={{ "textAlign": "left" }}>
                            <div className="card-title">
                                <h2 className="text-center">Create Medical Record</h2>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="">
                                            <label>Patient Id</label>
                                            <input required value={patientId} onChange={(e) => { setPatientId(e.target.value); setCheckValid(false); setError("") }} className="form-control"></input>
                                            <br />
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="">
                                            <label>Doctor Id</label>
                                            <input value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setCheckValid(false); setError("") }} className="form-control" required></input>
                                            <br />
                                            {!checkValid && <span className="continue-btn" onClick={validate}>Continue</span>}
                                            {!checkValid && <Link to="/Dashboard/emr"><span className="back-btn" >Cancel</span></Link>}
                                            {!checkValid && <span style={{ color: "red", marginLeft: "5rem" }}>{error}</span>}
                                        </div>
                                    </div>
                                    {checkValid &&
                                        <>
                                            <div className="">
                                                <div className="">
                                                    <label>Date</label>
                                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" required></input>
                                                    <br />
                                                </div>
                                            </div>

                                            <div className="">
                                                <div className="">
                                                    <label>Diagnosis</label>
                                                    <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="form-control" required></input>
                                                    <br />
                                                </div>
                                            </div>

                                            <div className="">
                                                <div className="">
                                                    <label>Prescription</label>
                                                    <input value={prescription} onChange={(e) => setPrescription(e.target.value)} className="form-control" required></input>
                                                    <br />
                                                </div>
                                            </div>

                                            <div className="">
                                                <div className="">
                                                    <label>Notes</label>
                                                    <input value={notes} onChange={(e) => setNotes(e.target.value)} className="form-control" required></input>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mt-3">
                                                    <button className="continue-btn" type="submit">Save</button>
                                                    <span className="back-btn" onClick={Back}>Back</span>
                                                   
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>

                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateRecord;