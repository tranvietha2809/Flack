class channel_messages:
    def __init__(self):
        self.queue = list()
        self.max_size = 100
    def insert_message(self,message_info):
        if len(self.queue)>self.max_size:
              self.queue.pop(0)
        self.queue.append(message_info)
    def get_channel_history(self):
        return self.queue
    def delete_message(self,timestamp):
        messages = self.queue
        for message in messages:
            if message['timestamp'] == timestamp:
                messages.remove(message)
