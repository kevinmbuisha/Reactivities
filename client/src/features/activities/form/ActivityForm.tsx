import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";

export default function ActivityForm() {
    const {id} = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (activity) {
            // Update existing activity - preserve all fields
            const updatedActivity: Activity = {
                ...activity,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                date: new Date(formData.get('date') as string).toISOString(),
                city: formData.get('city') as string,
                venue: formData.get('venue') as string,
            };
            await updateActivity.mutateAsync(updatedActivity);
            navigate(`/activities/${activity.id}`);
        } else {
            // Create new activity - provide all required fields
            const newActivity: Activity = {
                id: crypto.randomUUID(), // Generate client-side ID
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                date: new Date(formData.get('date') as string).toISOString(),
                city: formData.get('city') as string,
                venue: formData.get('venue') as string,
                isCancelled: false,
                latitude: 0,
                longitude: 0,
            };
            createActivity.mutate(newActivity, {
                onSuccess: (id) => {
                    navigate(`/activities/${id}`)
                }
            });
        }
    }

    if (isLoadingActivity) return <Typography>Loading activity...</Typography>

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit activity' : 'Create activity'}
            </Typography>
            <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}>
                <TextField name='title' label='Title' defaultValue={activity?.title} required />
                <TextField name='description' label='Description' defaultValue={activity?.description} multiline rows={3} required />
                <TextField name='category' label='Category' defaultValue={activity?.category} required />
                <TextField name='date' label='Date' type="date"
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    required
                    InputLabelProps={{ shrink: true }}
                />
                <TextField name='city' label='City' defaultValue={activity?.city} required />
                <TextField name='venue' label='Venue' defaultValue={activity?.venue} required />
                <Box display='flex' justifyContent='end' gap={3}>
                    <Button onClick={() => navigate(-1)} color='inherit'>Cancel</Button>
                    <Button
                        type="submit"
                        color='success'
                        variant="contained"
                        disabled={updateActivity.isPending || createActivity.isPending}
                    >Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}