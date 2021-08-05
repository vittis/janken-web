import ReactParticles, { ISourceOptions } from "react-tsparticles";

const Particles = () => {
  return (
    <ReactParticles
      id="tsparticles"
      className="particles-wrapper"
      options={
        {
          backgroundMode: {
            enable: true,
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 25,
              density: {
                enable: true,
                value_area: 1000,
              },
            },
            color: {
              value: "#fff",
            },
            size: {
              value: 2,
              random: true,
            },
            line_linked: {
              enable: false,
              distance: 60,
              color: "#fff",
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "top",
              random: true,
            },
          },
          interactivity: {
            detect_on: "window",
            events: {
              onhover: {
                enable: true,
                mode: "bubble",
              },
            },
            modes: {
              bubble: {
                distance: 350,
                size: 0,
                duration: 2,
                opacity: 0,
                speed: 3,
              },
            },
          },
          retina_detect: true,
        } as ISourceOptions
      }
    />
  );
};

export default Particles;
