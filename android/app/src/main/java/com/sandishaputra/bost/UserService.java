package com.sandishaputra.bost;

import android.content.Context;
import android.util.Log;

import androidx.annotation.Keep;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class UserService extends IUserService.Stub {

    public UserService() {}

    @Keep
    public UserService(Context context) {}

    @Override
    public String executeCommand(String command) {

        try {

            Process process = Runtime.getRuntime().exec(
                    new String[]{"sh", "-c", command}
            );

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()
                            )
                    );

            StringBuilder output = new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();

            return output.toString().trim();

        } catch (Exception e) {
            return e.toString();
        }
    }

    @Override
    public void exit() {
        Log.i("UserService", "exit");
        System.exit(0);
    }
}