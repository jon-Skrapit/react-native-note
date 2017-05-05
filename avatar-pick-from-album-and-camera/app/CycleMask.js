import React, {
    Component
} from 'react';

import {Animated, Image} from 'react-native'

import Svg, {
    Path,
    Rect,
    G,
    Defs,
    Stop,
    RadialGradient,
    Polyline,
    ClipPath,
    Circle,
    Text
} from 'react-native-svg';

class CycleMask extends Component{
    static title = 'CycleMask Sample.';

    constructor(props) {
      super(props);
    }
    componentDidMount() { }
    render() {
         return (
        <Image source={require('../Images/logo.png')}
          style={{width:300,height:300}}
           >
          <Svg
              height="300"
              width="300">
            <Defs>
                <ClipPath id="clip">
                    <Circle cx="50%" cy="50%" r="40%"/>
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                    />
                </ClipPath>
            </Defs>
            <Rect
            width="100%"
            height="100%"
            fillOpacity="0.5"
            clipPath="url(#clip)"
            clipRule="evenodd"
            />
          </Svg>
        </Image>
        )
    }
}

class StrokeDashoffset extends Component{
    static title = 'the strokeDashoffset attribute specifies the distance into the dash pattern to start the dash.';
    constructor(props) {
      super(props);
      this.animationStarted = false
      this.state = {
        animator: new Animated.Value(0), // inits to zero
        strokeDashoffset:0,
      };
      this.state.animator.addListener((p) => {
        this.setState({
          strokeDashoffset: p.value,
        });
      });
    }
    _animationStart(){
      if(!this.animationStarted)return
      Animated.sequence([
        Animated.timing(
          this.state.animator,
          {
            toValue: this.state.strokeDashoffset+=20,
            easing: value=>value,
            duration:2000,
            useNativeDriver:true,
          },
        )
      ]).start(()=>{
          this._animationStart()
        }) 
    }
    componentDidMount() {
      this.animationStarted = true
      this._animationStart()
    }
    componentWillUnmount() {
      this.animationStarted = false
    }
    render() {
        return <Svg height="80" width="200">
            <Defs>
                <RadialGradient id="grad" cx="50%" cy="50%" rx="80%" ry="80%" fx="50%" fy="50%">
                    <Stop
                        offset="50%"
                        stopColor="#fff"
                        stopOpacity="0.5"
                    />
                    <Stop
                        offset="100%"
                        stopColor="#f00"
                        stopOpacity="1"
                    />
                </RadialGradient>
               
            </Defs>
            <Rect
                x="5"
                y="5"
                height="70"
                width="190"
                fill="blue"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="10"
                strokeDashoffset={this.state.strokeDashoffset}
                clipPath="url(#clip)"
            />

            <Polyline
                strokeDasharray="10,10"
                points="10,10 20,12 30,20 40,60 60,70 90,55"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5"
            />
        </Svg>;
    }
}


const icon = <Svg
    height="20"
    width="20"
>
    <G fill="none" stroke="black" strokeWidth="2">
        <Path strokeDasharray="2,2" d="M0 4 h20" />
        <Path strokeDasharray="4,4" d="M0 10 h20" />
        <Path strokeDasharray="4,2,1,1,1,6" d="M0 19 h20" />
    </G>
</Svg>;

const samples = [StrokeDashoffset, CycleMask];
export {
    icon,
    samples
};