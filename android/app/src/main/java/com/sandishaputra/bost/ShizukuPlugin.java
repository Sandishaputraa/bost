package com.sandishaputra.bost;


import android.content.pm.PackageManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.InputStreamReader;


import moe.shizuku.api.Shizuku;



@CapacitorPlugin(name = "ShizukuPlugin")
public class ShizukuPlugin extends Plugin {



    private static final int REQUEST_CODE = 1001;




    @PluginMethod
    public void checkStatus(PluginCall call) {


        JSObject result =
                new JSObject();


        boolean available =
                false;


        boolean permission =
                false;



        try {


            available =
                    Shizuku.pingBinder();



            if (available) {


                permission =
                        Shizuku.checkSelfPermission()
                        == PackageManager.PERMISSION_GRANTED;


            }


        }

        catch (Exception e) {


            available = false;
            permission = false;


        }




        result.put(
                "available",
                available
        );


        result.put(
                "permission",
                permission
        );



        call.resolve(result);


    }







    @PluginMethod
    public void requestPermission(PluginCall call) {



        if (!Shizuku.pingBinder()) {


            call.reject(
                    "Shizuku belum aktif"
            );


            return;

        }




        if (
            Shizuku.checkSelfPermission()
            == PackageManager.PERMISSION_GRANTED
        ) {


            JSObject result =
                    new JSObject();


            result.put(
                    "granted",
                    true
            );


            call.resolve(result);


            return;


        }





        Shizuku.addRequestPermissionResultListener(
                new Shizuku.OnRequestPermissionResultListener() {


                    @Override
                    public void onRequestPermissionResult(
                            int requestCode,
                            int grantResult
                    ) {


                        if (requestCode == REQUEST_CODE) {


                            JSObject result =
                                    new JSObject();


                            result.put(
                                    "granted",
                                    grantResult
                                    ==
                                    PackageManager.PERMISSION_GRANTED
                            );


                            call.resolve(result);



                            Shizuku
                            .removeRequestPermissionResultListener(this);


                        }


                    }

                }
        );




        Shizuku.requestPermission(
                REQUEST_CODE
        );


    }







    @PluginMethod
    public void executeCommand(PluginCall call) {



        String command =
                call.getString(
                        "command"
                );



        if (command == null ||
            command.trim().isEmpty()
        ) {


            call.reject(
                    "Command kosong"
            );


            return;


        }





        if (!Shizuku.pingBinder()) {


            call.reject(
                    "Shizuku tidak aktif"
            );


            return;


        }





        if (
            Shizuku.checkSelfPermission()
            != PackageManager.PERMISSION_GRANTED
        ) {


            call.reject(
                    "Permission Shizuku belum diberikan"
            );


            return;


        }





        try {



            Process process =
                    Shizuku.newProcess(
                            new String[]{
                                    "sh",
                                    "-c",
                                    command
                            },
                            null,
                            null
                    );




            BufferedReader outputReader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()
                            )
                    );



            BufferedReader errorReader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getErrorStream()
                            )
                    );




            StringBuilder output =
                    new StringBuilder();



            String line;



            while(
                (line = outputReader.readLine())
                != null
            ) {


                output.append(line)
                        .append("\n");


            }





            StringBuilder error =
                    new StringBuilder();



            while(
                (line = errorReader.readLine())
                != null
            ) {


                error.append(line)
                        .append("\n");


            }





            int exitCode =
                    process.waitFor();




            JSObject result =
                    new JSObject();



            result.put(
                    "exitCode",
                    exitCode
            );


            result.put(
                    "output",
                    output.toString().trim()
            );


            result.put(
                    "error",
                    error.toString().trim()
            );




            call.resolve(result);



        }

        catch(Exception e) {


            call.reject(
                    "Eksekusi gagal: "
                    + e.getMessage()
            );


        }


    }


}