import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, updateProfile } = useAuth();

  const submit = user => {
    updateProfile(user);
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Update Profile" />
        <form onSubmit={handleSubmit(submit)}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            defaultValue={user.name}
            type="text"
            {...register('name', {
              required: true,
              minLength: 5,
            })}
          />
          {errors.name && <span className={classes.error}>Name is required and should be at least 5 characters</span>}

          <label htmlFor="address">Address</label>
          <input
            id="address"
            defaultValue={user.address}
            type="text"
            {...register('address', {
              required: true,
              minLength: 10,
            })}
          />
          {errors.address && <span className={classes.error}>Address is required and should be at least 10 characters</span>}

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}
