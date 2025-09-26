import json
import pandas as pd
import plotly.express as px

# --- 1. Load and Process Data ---
try:
    with open('activity.json', 'r') as f:
        data = json.load(f)
    if not data:
        print("activity.json is empty. No chart generated.")
        exit()
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error reading activity.json: {e}")
    exit()

df = pd.DataFrame(data)
df['date'] = pd.to_datetime(df['date'])
daily_activity = df.groupby(df['date'].dt.date).size().reset_index(name='count')
daily_activity['date'] = pd.to_datetime(daily_activity['date'])

# --- 2. Create the Interactive Plot ---
fig = px.bar(
    daily_activity,
    x='date',
    y='count',
    title='My Daily Learning Activity',
    labels={'date': 'Date', 'count': 'Number of Activities'},
    template='plotly_dark' # Use a dark theme
)

# Customize the hover text for better readability
fig.update_traces(hovertemplate='<b>%{x|%B %d, %Y}</b><br>Activities: %{y}')

# --- 3. Save the Plot as an HTML file ---
fig.write_html("interactive_activity_chart.html", include_plotlyjs='cdn')

print("✅ Successfully generated 'interactive_activity_chart.html'")
