<template>
    <div class="layout">
        <div class="agents-container">
            <div v-for="agent in agents" :key="agent.process_id" class="agent">
                <h2>{{ agent.agent }}</h2>
                <p><strong>State:</strong> {{ agent.state }}</p>
                <p><strong>Available Actions:</strong></p>
                <ul>
                    <li v-for="action in agent.available_actions" :key="action">
                        <button @click="performAction(agent.process_id, action)">
                            {{ action }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="conversation-log">
            <div v-for="message in messages" :key="message.id" class="message">
                <h3>{{ message.agent }} <span v-html="message.emotion"></span></h3>
                <p><em>{{ message.thoughts }}</em></p>
                <p>{{ message.spokenWords }}</p>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, type Ref, ref } from 'vue';


interface Agent {
    agent: string;
    process_id: string;
    parent_process_id: string | null;
    state: string;
    available_actions: string[];
    title: string | null;
    created: string;
    updated: string;
}

interface Message {
    id: number;
    agent: string;
    emotion: string;
    thoughts: string;
    spokenWords: string;
}


export default defineComponent({
    name: 'AgentComponent',
    setup() {
        const agents: Ref<Agent[]> = ref([]);
        const messages: Ref<Message[]> = ref([]);


        const fetchAgents = async () => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await fetch(`${baseUrl}/processes`, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    agents.value = data.processes;
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("There was a problem fetching the agents:", error);
            }
        };

        const fetchMessages = () => {
            // Assuming data is the JSON string you provided
            const rawData = "### Gathering agent thoughts and emotions.\n### Allowing agents to speak.\n### Recording thoughts with other agents.\n##### Agent: Ross\n<span style='color:#6677aa'>Emotion: amused 😏</span>\n\n<span style='color:#66aa44'>Thoughts: Oh, this is a loaded question. Given my love for history and the slightly nerdy side of things, I'm tempted to say something like 'The Crown' for its historical accuracy and drama. But knowing Rachel and Ross, they might be expecting something more contemporary or even something science fiction. Maybe I should throw in a curveball and say 'Stranger Things' for its blend of 80s nostalgia, science fiction, and horror. That should stir up the conversation a bit.</span>\n\n\"Well, if we're talking about the best show on TV right now, I'd have to throw 'Stranger Things' into the ring. Not only does it have that delicious blend of 80s nostalgia, science fiction, and horror that seems to resonate with a wide audience, but it also beautifully integrates elements of friendship, loyalty, and the battle between good and evil. Plus, the scientific inaccuracies are so glaring that they're actually entertaining to point out. It's like a treasure hunt for every paleontologist and scientist watching.\"\n\n---\n##### Agent: Rachel\n<span style='color:#6677aa'>Emotion: excited 😊</span>\n\n<span style='color:#66aa44'>Thoughts: I think the best show on TV right now has to be one that combines great fashion with engaging storytelling. Maybe something like 'Emily in Paris', because of its focus on fashion and Parisian lifestyle. It's so vibrant and colorful, and it really speaks to my love for fashion!</span>\n\n\"Oh, definitely, I think 'Emily in Paris' is up there for me. It's just so stylish and fun, and honestly, it's a bit of a dream scenario, isn't it? Living in Paris, working in fashion. Plus, the drama and romance add a nice touch. It's like a little escape every time I watch it. What do you guys think? Have you seen it?\"\n\n---\n";
            const agentSections = rawData.split('---\n').filter(section => section.trim() !== '');

            const parsedMessages = agentSections.map((section, index) => {
                const agentMatch = section.match(/##### Agent: (.*)\n/);
                const emotionMatch = section.match(/<span style='color:#6677aa'>(.*?)<\/span>/);
                const thoughtsMatch = section.match(/<span style='color:#66aa44'>(.*?)<\/span>/);
                const spokenWords = section.split('\n').slice(3).join('\n').trim(); // Assuming spoken words start from the 4th line

                return {
                    id: index,
                    agent: agentMatch ? agentMatch[1] : '',
                    emotion: emotionMatch ? emotionMatch[1] : '',
                    thoughts: thoughtsMatch ? thoughtsMatch[1] : '',
                    spokenWords: spokenWords
                };
            });

            messages.value = parsedMessages;
        };

        onMounted(() => {
            fetchAgents();
            fetchMessages(); // Call this function to simulate fetching the messages
        });

        const performAction = (processId: string, action: string) => {
            // TODO: Implement action handling logic
            console.log(`Action "${action}" triggered for process ID: ${processId}`);
            // You might dispatch a request or emit an event here
        };

        return {
            agents,
            performAction,
            messages
        };
    },
});
</script>

<style scoped>
.layout {
    display: flex;
    gap: 32px;
    /* Adjust the gap between the agents and the log as needed */
}

.agents-container {
    flex: 30%;
    /* Agents take up 30% of the screen width */
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: left;
    max-width: 30%;
    /* Ensure it does not grow beyond 30% */
    overflow-y: auto;
    /* Add scrolling to the agents container if needed */
}

.agent {
    border: 1px solid #ddd;
    /* Light grey border */
    padding: 16px;
    border-radius: 8px;
    /* Rounded corners */
    background-color: #f9f9f9;
    /* Light background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Soft shadow for depth */
    width: 100%;
    /* Ensure agents container fills the allocated 30% width */
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #0057ff;
    /* Example button color, change as needed */
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #003eb3;
    /* Darker shade when hovered */
}

.conversation-log {
    flex: 70%;
    /* Messages take up the remaining 70% of the screen width */
    overflow-y: auto;
    /* Enables scrolling */
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    height: auto;
    /* Adjust based on content or set a fixed height */
}

.message {
    margin-bottom: 8px;
}
</style>