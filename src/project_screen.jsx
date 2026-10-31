import { createSignal, Show } from "solid-js";
import projects from './project.json'

export const [project, setProject] = createSignal(null);

export default function ProjectScreen(props) {
    function playsound() {
        props.audiomanager.playUI()
    } 
    return (
        <Show when={project()} >
            {(name) => (
                <div className="project-ui">
                    <button className="close-button" onClick={() => {
                        playsound()
                        setProject(null)
                        }}>
                        [ X ]
                    </button>
                    <div className="banner-container">
                        <img
                        src={projects[name()].image}
                        alt={projects[name()].title}
                        class="project-banner"
                        />
                    </div>
                    <h2 className="title">{projects[name()].title}</h2>
                    <p className="description">{projects[name()].description}</p>
                    <div className="button-container">
                        <button className="source-button" onClick={() => {
                            playsound()
                            window.open(projects[name()].sourcelink, '_blank', 'noopener,noreferrer')
                            }}>
                            {console.log(projects[name()].link)}
                            {projects[name()].buttonTextSource ?? 'source Project'}
                        </button>
                        <button className="visit-button" disabled={!projects[name()].demolink} onClick={() => {
                            playsound()
                            if (name() == 'OneBonker') {
                                fetch('onebonkeruri.txt')
                                .then(res => res.text())
                                .then(text => navigator.clipboard.writeText(text))
                                alert("You copied the Uri now paster in the browser address")
                            } else {
                                window.open(projects[name()].demolink, '_blank', 'noopener,noreferrer')
                            }}}>
                            {console.log(projects[name()].link)}
                            {projects[name()].buttonText ?? 'visit Project'}
                        </button>
                    </div>
                </div>
            )}
        </Show>
    );
}