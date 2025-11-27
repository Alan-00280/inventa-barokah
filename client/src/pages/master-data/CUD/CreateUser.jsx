import {
    Dialog,
    Button,
    Input,
    Checkbox,
    Typography,
    IconButton,
    Select,
} from "@material-tailwind/react";
import axios from "axios";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";
import { data, useNavigate } from "react-router";

export default function DialogCreateUser({f={setLoading: ()=>{}, setErr: ()=>{}}}) {

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

    //? data role (untuk option) ?//
    const [roles, setRoles] = useState([])
    useEffect(()=>{
        const fetchRole = async () => {
            try {
                f.setLoading(true)
                const fetchedRole = await axios.get(localAPIRoute+'/pengguna/role');
                setRoles(fetchedRole.data.roles)
            } catch (error) {
                f.setErr(error)
            } finally {
                f.setLoading(false)
            }
        }
        fetchRole()
    }, [])

    //? preparing data nya ?//
    const [userData, setUserData] = useState({
        nama: '',
        idrole: '',
        pass: ''
    });
    const handleChange = (e) => {
        setUserData(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    const resetUser = () => {
        setUserData ({
            nama: '',
            idrole: '',
            pass: ''
        })
    }

    //? Handel submit ?//
    const handleSubmit = async () => {
        try {
            const postUser = await axios.post(localAPIRoute+'/pengguna/role', {
                data_user: userData
            })
            alert('Berhasil menambahkan user')
            navigate('/master-data/pengguna')
        } catch (error) {
            f.setErr(error)
            alert(JSON.stringify(error))
        }
    }


    return (
        <Dialog size="sm" open={isOpen} onOpenChange={(isopen) => {if (!isopen) {resetUser(); setIsOpen(false)}} }>
            <Dialog.Trigger as={Button} className='mb-2' onClick={()=>setIsOpen(true)}><Plus className="w-5 h-5"  /> Tambah User</Dialog.Trigger>
            <Dialog.Overlay>
                <Dialog.Content>
                    <Dialog.DismissTrigger
                        as={IconButton}
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        className="absolute right-2 top-2"
                        isCircular
                    >
                    <X className="h-5 w-5" onClick={()=>setIsOpen(false)}/>
                    </Dialog.DismissTrigger>
                    <Typography type="h6" className="mb-1">
                        Tambah Pengguna
                    </Typography>
                    <Typography className="text-foreground">
                        Masukkan Nama, Role, dan Password User baru
                    </Typography>
                    {/* <Logger Object={userData} /> */}
                    <form className="mt-6">
                        <div className="mb-4 mt-2 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="nama"
                                type="small"
                                color="default"
                                className="font-semibold"
                                onChange={(e) => handleChange(e)}
                            >
                                Nama
                            </Typography>
                            <Input
                                id="nama"
                                type="text"
                                placeholder="Masukan Nama . . . "
                                name="nama"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-4 mt-2 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="role"
                                type="small"
                                color="default"
                                className="font-semibold"
                            >
                                Role
                            </Typography>
                            <Select
                                value={userData.idrole}
                                onValueChange={(v) => (handleChange({target: {name: 'idrole', value: v}}))}
                            >
                                <Select.Trigger className="w-72" placeholder="Pilih Role" />
                                <Select.List>
                                    {roles && 
                                        roles.map(r=>(
                                            <Select.Option key={r.idrole} value={r.idrole}>{r.nama_role}</Select.Option>
                                        ))
                                    }
                                </Select.List>
                            </Select>
                        </div>
                        <div className="mb-4 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="password"
                                type="small"
                                color="default"
                                className="font-semibold"
                            >
                                Password
                            </Typography>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="************" 
                                name="pass"
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <Button isFullWidth onClick={handleSubmit}>Buat</Button>
                    </form>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog>
    );
}
