import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import agent from '../api/agent';

export const useActivities = () => {
    
  const queryClient = useQueryClient();

  const {data: activities, isPending} = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await agent.get<Activity[]>('/activities');
      return response.data;
    }
  });

  const updateActivity = useMutation({
    mutationKey: ['updateActivity'],
    mutationFn: async (activity: Activity) => {
      await agent.put('/activities', activity);
      return activity;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  })
  
  const createActivity = useMutation({
    mutationKey: ['createActivity'],
    mutationFn: async (activity: Activity) => {
      const response = await agent.post<string>('/activities', activity);
      return { ...activity, id: response.data };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  })
  
  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting activity with ID:', id);
      console.log('Full URL:', `${import.meta.env.VITE_API_URL}/activities/${id}`);
      await agent.delete(`/activities/${id}`);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  })

  return { activities, isPending, updateActivity, createActivity, deleteActivity };
}