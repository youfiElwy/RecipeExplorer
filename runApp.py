import subprocess
import threading

def run_command(command):
    try:
        print("Executing command: {}".format(command))
        return_code = subprocess.call(command, shell=True)
        if return_code != 0:
            raise subprocess.CalledProcessError(return_code, command)
        print("Command succeeded: {}".format(command))
    except subprocess.CalledProcessError as e:
        print("Error executing command {}: {}".format(command, e))

# List of commands to run in parallel
backend_commands = [
    "cd backend && npm start"
]

frontend_commands = [
    "cd frontend && npm start"
]

threads = []

# Function to run commands
def run_commands(commands):
    for command in commands:
        run_command(command)

# Create threads for backend and frontend commands
backend_thread = threading.Thread(target=run_commands, args=(backend_commands,))
frontend_thread = threading.Thread(target=run_commands, args=(frontend_commands,))

# Start threads
backend_thread.start()
frontend_thread.start()

# Add threads to the list
threads.append(backend_thread)
threads.append(frontend_thread)

# Wait for all threads to complete
for thread in threads:
    thread.join()
