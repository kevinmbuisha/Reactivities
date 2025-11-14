import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/types/hooks/useActivities";
import { type FormEvent } from 'react';

type Props = {
    activity?: Activity;
    closeForm: () => void;
    onActivityUpdated?: (activity: Activity) => void;
}   

export default function ActivityForm({activity, closeForm, onActivityUpdated}: Props) {

    const {updateActivity, createActivity} = useActivities();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (activity) {
            const updatedActivity: Activity = {
                ...activity,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                date: formData.get('date') as string,
                city: formData.get('city') as string,
                venue: formData.get('venue') as string,
            };
            
            await updateActivity.mutateAsync(updatedActivity);
            onActivityUpdated?.(updatedActivity);
            closeForm();
        } else {
            const newActivity: Activity = {
                id: '',
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                date: formData.get('date') as string,
                city: formData.get('city') as string,
                venue: formData.get('venue') as string,
                isCancelled: false,
                latitude: 0,
                longitude: 0,
            };
            
            const result = await createActivity.mutateAsync(newActivity);
            onActivityUpdated?.(result);
            closeForm();
        }
    }

    return (
        <Paper sx={{borderRadius: 3, padding: 3}}>
            <Typography variant="h5" gutterBottom color="primary">
                Create activity
            </Typography>
            <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}>
                <TextField name="title" label='Title' defaultValue={activity?.title} />
                <TextField name="description" label='Description' multiline rows={3} defaultValue={activity?.description} />
                <TextField name="category" label='Category' defaultValue={activity?.category} />
                <TextField name="date" label='Date' type="date" 
                    defaultValue={activity?.date ? new Date(activity.date).toISOString().split('T')[0] : ''} />
                <TextField name="city" label='City' defaultValue={activity?.city} />
                <TextField name="venue" label='Venue' defaultValue={activity?.venue} />
                <Box display='flex' justifyContent='end' gap={3}>
                    <Button onClick={closeForm} color='inherit'>Cancel</Button>
                    <Button 
                        type="submit" 
                        color='success' 
                        variant="contained"
                        disabled={updateActivity.isPending || createActivity.isPending}
                        >Submit
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}