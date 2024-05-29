using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Helpers;

public class DateTimeJsonConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dateTimeFromJson = reader.GetString()!;

        return DateTime.ParseExact(dateTimeFromJson, "yyyy-MM-dd ddd HH:mm:ss", CultureInfo.InvariantCulture);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}