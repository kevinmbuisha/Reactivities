using System.Diagnostics;
using AutoMapper;
using Domain;
using Activity = Domain.Activity;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Define your AutoMapper profiles here
        CreateMap<Activity, Activity>();
    }

}
