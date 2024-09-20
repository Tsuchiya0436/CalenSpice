from rest_framework.response import Response
from rest_framework.decorators import api_view
import jpholiday
from datetime import datetime

@api_view(['GET'])
def get_holidays(request, year):
    try:
        year = int(year)
        holidays = jpholiday.year_holidays(year)
        holidays_data = [{"date": holiday[0].strftime('%Y-%m-%d'), "name": holiday[1]} for holiday in holidays]

        return Response({"year": year, "holidays": holidays_data})
    except ValueError:
        return Response({"error": "Invalid year format"}, status=400)