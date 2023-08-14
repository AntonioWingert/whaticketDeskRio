import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import whatsappIcon from '../../assets/whatsappIcon.png'

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	Select,
	InputLabel,
	MenuItem,
	FormControl,
	TextField,
	InputAdornment,
	IconButton,
	Avatar,
	Input
} from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { ProfileImageContext } from "../../context/ProfileImage/ProfileImageContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";
import { getBackendUrl } from "../../config";

const backendUrl = getBackendUrl();

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	formDiv: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-around",
	},
	avatar: {
		width: theme.spacing(12),
		height: theme.spacing(12),
		margin: theme.spacing(2),
		cursor: 'pointer',
		borderRadius: '50%',
		border: '2px solid #ccc',
	},
	updateDiv: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	updateInput: {
		display: 'none',
	},
	updateLabel: {
		padding: theme.spacing(1),
		margin: theme.spacing(1),
		textTransform: 'uppercase',
		textAlign: 'center',
		cursor: 'pointer',
		border: '2px solid #ccc',
		borderRadius: '5px',
		minWidth: 160,
		fontWeight: 'bold',
		color: '#555',
	},
	errorUpdate: {
		border: '2px solid red',
	},
	errorText: {
		color: 'red',
		fontSize: '0.8rem',
		fontWeight: 'bold',
	}
}));

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
	profileImage: Yup.mixed()
		.nullable()
		.test('fileType', 'Unsupported File Format', value => {
			if (!value) return true
			return value && SUPPORTED_FORMATS.includes(value.type)
		})
		.test('fileSize', 'File too large, max 2mb', value => {
			if (!value) return true
			return value && value.size <= 2 * 1024 * 1024
		}),
});

const UserModal = ({ open, onClose, userId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		password: "",
		profile: "user",
		avatar: null,
		profileImage: null,
	};

	const { user: loggedInUser } = useContext(AuthContext);
	const { updateProfileImage } = useContext(ProfileImageContext);

	const [user, setUser] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [whatsappId, setWhatsappId] = useState(false);
	const { loading, whatsApps } = useWhatsApps();

	useEffect(() => {
		const fetchUser = async () => {
			if (!userId) return;
			try {
				const { data } = await api.get(`/users/${userId}`);
				const { profileImage } = data;
				const profileUrl = profileImage ? `${backendUrl}/profilePics/${profileImage}` : null;

				setUser(prevState => {
					return { ...prevState, ...data, avatar: profileUrl };
				});

				if (userId === loggedInUser.id) updateProfileImage(profileUrl);

				const userQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(userQueueIds);
				setWhatsappId(data.whatsappId ? data.whatsappId : '');
			} catch (err) {
				toastError(err);
			}
		};

		fetchUser();
	}, [userId, open]);

	const handleClose = () => {
		onClose();
		setUser(initialState);
	};

	const handleSaveUser = async values => {
		const formData = new FormData();
		formData.append('profileImage', values.profileImage);
		formData.append('name', values.name);
		formData.append('email', values.email);
		formData.append('password', values.password);
		formData.append('profile', values.profile);
		formData.append('avatar', values.avatar);

		const whatsappIdValue =  whatsappId ? whatsappId : '';
		formData.append('whatsappId', whatsappIdValue);

		if (selectedQueueIds.length > 0) {
			for (const id of selectedQueueIds) {
				formData.append('queueIds[]', id);
			}
		} else {
			formData.delete('queueIds[]');
		}

		try {
			if (userId) {
				await api.put(`/users/${userId}`, formData);
			} else {
				await api.post("/users", formData);
			}
			toast.success(i18n.t("userModal.success"));
		} catch (err) {
			toastError(err);
		}
		if (userId === loggedInUser.id) updateProfileImage(user.avatar);
		handleClose();
	};

	const handleUpdateProfileImage = (e) => {
		if (!e.target.files[0]) return;

		setUser(prevState => ({
			...prevState,
			avatar: URL.createObjectURL(e.target.files[0]),
			profileImage: e.target.files[0]
		}));
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="md"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					{userId
						? `${i18n.t("userModal.title.edit")}`
						: `${i18n.t("userModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveUser(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form encType="multipart/form-data">
							<DialogContent dividers className={classes.formDiv}>
								<FormControl className={classes.updateDiv}>
									<label htmlFor="profileImage">
										<Avatar
											src={user.avatar ? user.avatar : whatsappIcon}
											alt="profile-image"
											className={`${classes.avatar} ${touched.profileImage && errors.profileImage ? classes.errorUpdate : ''}`}
										/>
									</label>
									<FormControl className={classes.updateDiv}>
										<label htmlFor="profileImage"
											className={`${classes.updateLabel} ${touched.profileImage && errors.profileImage ? classes.errorUpdate : ''}`}
										>
											{user.profileImage ? 'Atualizar Imagem' : 'Adicionar Imagem'}
										</label>
										{
											touched.profileImage && errors.profileImage && (
												<span className={classes.errorText}>{errors.profileImage}</span>)
										}
										<Input
											type="file"
											name="profileImage"
											id="profileImage"
											className={classes.updateInput}
											onChange={event => handleUpdateProfileImage(event)}
										/>
									</FormControl>
									{user.avatar &&
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => setUser(prevState => ({ ...prevState, avatar: null, profileImage: null }))}
										>
											Remover Imagem
										</Button>
									}
								</FormControl>
								<div>
									<div className={classes.multFieldLine}>
										<Field
											as={TextField}
											label={i18n.t("userModal.form.name")}
											autoFocus
											name="name"
											error={touched.name && Boolean(errors.name)}
											helperText={touched.name && errors.name}
											variant="outlined"
											margin="dense"
											fullWidth
										/>
										<Field
											as={TextField}
											name="password"
											variant="outlined"
											margin="dense"
											label={i18n.t("userModal.form.password")}
											error={touched.password && Boolean(errors.password)}
											helperText={touched.password && errors.password}
											type={showPassword ? 'text' : 'password'}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															aria-label="toggle password visibility"
															onClick={() => setShowPassword((e) => !e)}
														>
															{showPassword ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												)
											}}
											fullWidth
										/>
									</div>
									<div className={classes.multFieldLine}>
										<Field
											as={TextField}
											label={i18n.t("userModal.form.email")}
											name="email"
											error={touched.email && Boolean(errors.email)}
											helperText={touched.email && errors.email}
											variant="outlined"
											margin="dense"
											fullWidth
										/>
										<FormControl
											variant="outlined"
											className={classes.formControl}
											margin="dense"
										>
											<Can
												role={loggedInUser.profile}
												perform="user-modal:editProfile"
												yes={() => (
													<>
														<InputLabel id="profile-selection-input-label">
															{i18n.t("userModal.form.profile")}
														</InputLabel>
														<Field
															as={Select}
															label={i18n.t("userModal.form.profile")}
															name="profile"
															labelId="profile-selection-label"
															id="profile-selection"
															required
														>
															<MenuItem value="admin">Admin</MenuItem>
															<MenuItem value="user">User</MenuItem>
														</Field>
													</>
												)}
											/>
										</FormControl>
									</div>
									<Can
										role={loggedInUser.profile}
										perform="user-modal:editQueues"
										yes={() => (
											<QueueSelect
												selectedQueueIds={selectedQueueIds}
												onChange={values => setSelectedQueueIds(values)}
											/>
										)}
									/>
									<Can
										role={loggedInUser.profile}
										perform="user-modal:editQueues"
										yes={() => (!loading &&
											<FormControl variant="outlined" margin="dense" className={classes.maxWidth} fullWidth>
												<InputLabel>{i18n.t("userModal.form.whatsapp")}</InputLabel>
												<Field
													as={Select}
													value={whatsappId}
													onChange={(e) => setWhatsappId(e.target.value)}
													label={i18n.t("userModal.form.whatsapp")}
												>
													<MenuItem value={''}>&nbsp;</MenuItem>
													{whatsApps.map((whatsapp) => (
														<MenuItem key={whatsapp.id} value={whatsapp.id}>{whatsapp.name}</MenuItem>
													))}
												</Field>
											</FormControl>
										)}
									/>
								</div>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("userModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{userId
										? `${i18n.t("userModal.buttons.okEdit")}`
										: `${i18n.t("userModal.buttons.okAdd")}`}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default UserModal;
