using System;
using System.ComponentModel;

namespace JobPortalv21.Extensions
{
    public static class GetEnumDescription
    {
        public static string GetDescription<TEnum>(this Enum source)
        {
            var description = string.Empty;
            var type = source.GetType();
            var members = type.GetMember(source.ToString());
            var descriptionAttributes = members[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (descriptionAttributes.Length > 0)
            {
                description = ((DescriptionAttribute)descriptionAttributes[0]).Description;
            }
            return description;
        }
    }
}