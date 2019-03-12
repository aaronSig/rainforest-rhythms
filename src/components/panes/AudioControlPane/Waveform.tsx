import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { State } from "../../../state/types";
import styles from "./Waveform.module.css";

interface WaveformProps {}

function WaveformView(props: WaveformProps) {
  const wavesurfer = useRef(null as any);
  const waveformRef = useRef(null as any);

  useEffect(() => {
    if (!waveformRef.current) {
      console.log("dropout");
      return;
    }

    const WaveSurfer = (window as any).WaveSurfer as any;
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      backend: "MediaElement",
      waveColor: "#020001",
      progressColor: "#FF450A",
      barWidth: 1,
      // barGap: 2,
      normalize: true,
      plugins: [
        WaveSurfer.cursor.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            "background-color": "#000",
            color: "#fff",
            padding: "2px",
            "font-size": "10px"
          }
        })
      ]
    });

    wavesurfer.current.load(
      "https://dl.boxcloud.com/api/2.0/files/381511138890/content?access_token=1!HxBWMzPJtbpcWrXISeDxb-dg-hds-EbL2RWt2sNzSJP9G3I2YU_1HhZRMG8Kas1HOX4oklPVKvn1CaYi634rhKpEYmNv898FF_A4feuA6ymQX_CCYNfYd2aJSVVQGz5dEbmgG_987XFodKb-64ypI09fiNGvsdwz7AurxqAa8S5osqe-co2OVKj9ltZBEXJ4OllCVdvfud1MH1BOcoiLoI7KHwrxJO1UgJerIGx3MtQR-GLRtOmt_NmSaYiDiCUiIowKWGsV-5ii2h6c2M57heFV-652K5zhFiEdj3K9z2uidAy2DcV1kmX3azkPNKnzTN4sPinhoCJ8L9qI4b1t48jU9ffLuexdcuGiSCYhXHal8-HLUMnN8SyiXV4yz2EsofSmyEjH98XBHWu5S1TyWtC5J-5D"
    );
    wavesurfer.current.on("ready", function() {
      console.log("ready");
      //   wavesurfer.current.play();
    });

    wavesurfer.current.on("waveform-ready", function() {
      console.log("waveform-ready");
    });

    return () => {
      if (wavesurfer.current) {
        console.log("Cleanup wavesurfer");
        wavesurfer.current.destroy();
      }
    };
  }, [wavesurfer, waveformRef]);

  return (
    <div className={styles.WaveformContainer}>
      <div ref={waveformRef} className={styles.Waveform} />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const Waveform = connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformView);

export default Waveform;
