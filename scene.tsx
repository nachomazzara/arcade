import { createElement, ScriptableScene } from "metaverse-api";

export default class RollerCoaster extends ScriptableScene<any> {
  state = { score: 0, src1: "", src2: "", switched: true };
  connection: WebSocket | null = null;

  sceneWillUnmount() {
    this.connection!.close();
  }

  sceneDidMount() {
    this.connection = new WebSocket("ws://localhost:8989", ["soap", "xmpp"]);
    this.connection!.addEventListener("message", (e: MessageEvent) => {
      const { end, score, src } = JSON.parse(e.data);
      if (!end) {
        console.log(this.state.switched);
        const key = this.state.switched ? "src1" : "src2";
        this.setState({
          [key]: src,
          score
        });
      }
      this.setState({ switched: !this.state.switched });
    });

    this.eventSubscriber.on("btn_left_click", () => {
      this.connection!.send("left");
    });
    this.eventSubscriber.on("btn_up_click", () => {
      this.connection!.send("up");
    });
    this.eventSubscriber.on("btn_right_click", () => {
      this.connection!.send("right");
    });
    this.eventSubscriber.on("btn_down_click", () => {
      this.connection!.send("down");
    });

    this.eventSubscriber.on("btn_retry_click", () => {
      this.connection!.send("retry");
    });
  }

  async render() {
    const { score, src1, src2, switched } = this.state;
    return (
      <scene position={{ x: 5, y: 0, z: 5 }}>
        <gltf-model
          src="assets/arcade.gltf"
          scale={{ x: 1, y: 1, z: 1 }}
          position={{ x: 0.1, y: 0, z: -0.3 }}
          rotation={{ x: 0, y: 270, z: 0 }}
        />
        <entity position={{ x: 0, y: 0.5, z: 0 }}>
          <text
            position={{ x: -0.02, y: 1.748, z: 0.4 }}
            rotation={{ x: -30, y: 10, z: -1 }}
            scale={{ x: 0.8, y: 0.8, z: 0.8 }}
            value={score.toString()}
            color="red"
            h-align="center"
          />
          <plane
            key={"1"}
            position={{ x: 0, y: 1, z: switched ? -0.1 : -0.3 }}
            material={{ src: src1, color: "white" }}
            rotation={{ x: 0, y: 10, z: 0 }}
          />
          <plane
            key={"2"}
            position={{ x: 0, y: 1, z: !switched ? -0.1 : -0.3 }}
            material={{ src: src2, color: "white" }}
            rotation={{ x: 0, y: 10, z: 0 }}
          />
          <entity
            position={{ x: 0.9, y: 1, z: 0 }}
            rotation={{ x: 90, y: -25, z: 0 }}
          >
            <gltf-model
              src="assets/btn.gltf"
              id="btn_down"
              position={{ x: 0, y: 0, z: 0.2 }}
              scale={{ x: 0.2, y: 0.2, z: 0.2 }}
              rotation={{ x: 0, y: 180, z: 0 }}
            />

            <gltf-model
              src="assets/btn.gltf"
              id="btn_left"
              position={{ x: -0.2, y: 0, z: 0 }}
              scale={{ x: 0.2, y: 0.2, z: 0.2 }}
              rotation={{ x: 0, y: 90, z: 0 }}
            />

            <gltf-model
              src="assets/btn.gltf"
              id="btn_right"
              position={{ x: 0.2, y: 0, z: 0 }}
              scale={{ x: 0.2, y: 0.2, z: 0.2 }}
              rotation={{ x: 0, y: 270, z: 0 }}
            />

            <gltf-model
              src="assets/btn.gltf"
              id="btn_up"
              position={{ x: 0, y: 0, z: -0.2 }}
              scale={{ x: 0.2, y: 0.2, z: 0.2 }}
            />

            <cylinder
              id="btn_retry"
              position={{ x: 0, y: 0, z: 0 }}
              color="black"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
          </entity>
        </entity>
      </scene>
    );
  }
}
