// https://www.trainingpeaks.com/learn/articles/running-training-stress-score-rtss-explained/
// https://medium.com/strava-engineering/improving-grade-adjusted-pace-b9a2a332a5dc
// https://medium.com/strava-engineering/an-improved-gap-model-8b07ae8886c3
// https://github.com/andrewhao/stressfactor

import { SportType } from "../integrations/strava/typescript-fetch-client/models"


// The most useful tools to quantify how hard you're training are those that account for both the volume and the intensity of your running.
// Running Training Stress ScoreTM (rTSS) is a trademark metric of TrainingPeaks

// Since running speed is function of power, and for most runners, speed or pace is the measure of greatest interest, we can use the same principles applied in the TSS system to quantify training stress in running. In particular, the elements of the normalized graded pace (NGP; info here), relative to the functional threshold pace (FTP; info here) in conjunction with the duration of the workout we can determine an appropriate rTSS score for each workout.

//s:number= duration of workout in seconds
//ngP:number= normalized graded pace (pace adjusted for elevation)
//iF:number= intensity factor (how hard the workout is compared to your threshold)
//ftp:number= functional threshold pace (avg pace you can hold when running all out for one hour)
//s:number= duration of workout in seconds


export const MY_sFTP=1.50
export const MY_rFTP=6.66
export const MY_cFTP=260



export const valid_cTss_sport_types = [SportType.EMountainBikeRide, SportType.GravelRide, SportType.Handcycle, SportType.MountainBikeRide, SportType.Ride, SportType.VirtualRide]

export const valid_rTss_sport_types = [SportType.Run, SportType.TrailRun, SportType.VirtualRun]

export function calcRunPace(metersParam:number, secondsParam:number, imperial=false){
    const km=metersParam/1000
    const min=secondsParam/60
    const hr=min/60
    const mi = (metersParam/1000)*0.621371

    // return { minutes, seconds: remainingSeconds };
    if (imperial) {
        // Convert kilometers per hour to miles per hour
        const speedMph: number = (mi / hr)
        // Calculate minutes per mile
        const minPerMile: number = 60 / speedMph;

        return minPerMile
    } else {
        // Convert meters per second to kilometers per hour
        const speedKph: number = (km / hr)
        // Calculate minutes per mile
        const minPerKm: number = 60 / speedKph;
        return minPerKm
    };
}


export function calc_rTss(S:number, NGP:number, FTP:number){
    // returns effort score 0-X (X>=100)

    // Convert pace to speed (miles per hour)
    const NGP_speed: number = 60 / NGP; // Convert pace to speed: 1 minute per mile is equivalent to 60 miles per hour
    const FTP_speed: number = 60 / FTP;

    // Constants
    const INTENSITY_FACTOR: number = NGP_speed / FTP_speed;
    const MAX_HOUR_FTP_POWER_OUTPUT: number = FTP_speed * 3600;

    // Calculate rTSS
    const EFFORT_POWER_OUTPUT: number = S * NGP_speed * INTENSITY_FACTOR;
    const rTSS: number = (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;

    return rTSS;
}
